import multer from 'multer';
import pg from 'pg';
import sgMail from '@sendgrid/mail';
// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'regina',
  host: 'localhost',
  database: 'uniforms',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('Error executing query', error.stack);
  } else if (result.rows.length === 0) {
    console.log('empty results!');
  }
};

const updateMembership = async (input, id) => {
  let updateQuery;
  if (input === 'Donor') {
    updateQuery = `UPDATE users SET is_donor = 't' WHERE id = '${id}'`;
  } else if (input === 'Recipient') {
    updateQuery = `UPDATE users SET is_recipient = 't' WHERE id = '${id}'`;
  } else {
    updateQuery = `UPDATE users SET is_donor = 't', is_recipient = 't' WHERE id = '${id}'`;
  }
  try {
    await pool.query(updateQuery);
    return null;
  } catch (e) {
    return e.toString();
  }
};

const getSchoolsList = (queryArray) => {
  const schoolsArray = [];
  queryArray.forEach((element) => {
    schoolsArray.push(element.school_name);
  });
  return schoolsArray;
};

// * Save file with original filename ie. hello.jpg/ hello.png
const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, (`${req.cookies.userEmail}_${file.originalname}`));
  },
});

const upload = multer({ storage });
const singleFileUpload = upload.single('photo');

const updateAndInsert = async (donorID, schoolID, uniformID, size, userID, quantity) => {
  const updateSQLs = [];
  const requestIds = [];
  try {
    for (let i = 0; i < quantity; i += 1) {
      const updateQuery = `UPDATE inventory SET status = 'reserved' 
                             WHERE donor_id = ${donorID}
                             AND school_id = ${schoolID}
                             AND uniform_id = ${uniformID}
                             AND size = '${size}' RETURNING id`;
      updateSQLs.push(pool.query(updateQuery));
    }
    const selectedInvIDs = await Promise.all(updateSQLs);

    const insertSQLs = [];
    const idObjArray = selectedInvIDs[0].rows;

    for (let j = 0; j < idObjArray.length; j += 1) {
      const itemID = idObjArray[j].id;
      requestIds.push(itemID);
      const requestTBQuery = `INSERT INTO donation_request (recipient_id, inventory_id) VALUES (${userID}, ${itemID}) RETURNING id`;
      insertSQLs.push(pool.query(requestTBQuery));
    }
    console.log(insertSQLs);
    await Promise.all(insertSQLs);
  } catch (err) {
    console.error(err.message); // wont break
  }
};
// response.redirect('/my_requests');
// find and alert Donor
const findDonorDetails = async () => {
  try {
    const findDonorQuery = `SELECT email, name, COUNT(reserved_date),
                               school_name, type, size
                            FROM users
                            INNER JOIN inventory
                            ON users.id = donor_id
                            INNER JOIN donation_request
                            ON inventory.id=inventory_id
                            INNER JOIN schools
                            ON schools.school_id = inventory.school_id
                            INNER JOIN uniforms
                            ON uniforms.id = uniform_id
                            WHERE reserved_date::date = now()::date
                            GROUP BY email, name, school_name, type, size`;
    const resultDonor = await pool.query(findDonorQuery);
    const num = resultDonor.rows.length;
    const lastReq = resultDonor.rows[num - 1];
    return lastReq;
  } catch (err) {
    console.error(err.message); // wont break
  }
};

// send donar email
const sendAnEmail = async (email, school_name, count, size, type) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      // to: [{'1reginacheong@gmail.com'},{}], // Change to your recipient
      to: [
        {
          email: '1reginacheong@gmail.com',
        },
        {
          email: `${email}`,
        },
      ],
      from: 'regina_cheong@hotmail.com', // Change to your verified sender
      subject: `There is a request for your donated ${school_name} uniforms`,
      text: `There is a request for the ${count} ${school_name} ${type} of size ${size}. lalala `,
      html: `<strong>There is a request for your ${count} piece(s) of ${school_name} ${type} of size ${size}.</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
    const data = {};
    data.message = 'Request Successful and the donor is notified via email';
    // response.render('null', { data });
    return data;
  } catch (err) {
    console.error(err.message); // wont break
  } };

// const summarizeManyItemsIntoObj = (everyData) => {
//   const combineActionObj = {};
//   everyData.forEach((item) => {
//     if (combineActionObj[`note_${item.name}`]) {
//       combineActionObj[`note_${item.name}`].on.push(item.action);
//     } else {
//       // new object
//       const { notes_id, ...newItem } = item;
//       newItem.action = [newItem.action]; // make it an array
//       combineActionObj[`note_${item.notes_id}`] = newItem;
//     }
//   });
//   const arrayOfObjects = Object.keys(combineActionObj).map((key) => {
//     const ar = combineActionObj[key];

//     // Apppend key if one exists (optional)
//     ar.key = key;

//     return ar;
//   });

//   const details = arrayOfObjects;
//   return details;
// };

export {
  whenQueryDone,
  updateMembership,
  getSchoolsList,
  singleFileUpload,
  updateAndInsert,
  findDonorDetails,
  sendAnEmail,
};
