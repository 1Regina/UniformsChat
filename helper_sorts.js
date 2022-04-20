import pg from 'pg';
// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'regina',
  host: 'localhost',
  database: 'uniforms',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

function dynamicAscSort(property) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function dynamicDescSort(property) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const result = a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
    return result * sortOrder;
  };
}

const sortDonations = async (request, response) => {
  const { userID } = request.cookies;
  const donatQuery = `SELECT school_name, 
                               type,
                               COUNT(inventory.school_id), size, status, DATE(created_on)
                        FROM schools
                        INNER JOIN inventory
                        ON schools.school_id = inventory.school_id
                        INNER JOIN uniforms
                        ON uniforms.id=inventory.uniform_id
                        WHERE donor_id = ${userID}
                        GROUP BY school_name, type, size , status, date`;
  const results = await pool.query(donatQuery);
  const data = results.rows;
  if (request.params.parameter === 'date') {
    const ascFn = (a, b) => new Date(a.date) - new Date(b.date);
    const descFn = (a, b) => new Date(b.date) - new Date(a.date);
    // sorting condition
    data.sort(request.params.sortHow === 'asc' ? ascFn : descFn);
  } else if (request.params.parameter === 'type') {
    data.sort(
      request.params.sortHow === 'asc'
        ? dynamicAscSort('type')
        : dynamicDescSort('type'),
    );
  } else if (request.params.parameter === 'quantity') {
    // sorting condition
    data.sort(
      request.params.sortHow === 'asc'
        ? dynamicAscSort('count')
        : dynamicDescSort('count'),
    );
  }
  response.render('showMyDonations', { data });
};

const sortRequests = async (request, response) => {
  const { userID } = request.cookies;
  const requestQuery = `SELECT school_name, 
                               type,
                               COUNT(inventory.school_id), size, status, DATE(reserved_date)
                        FROM schools
                        INNER JOIN inventory
                        ON schools.school_id = inventory.school_id
                        INNER JOIN uniforms
                        ON uniforms.id=inventory.uniform_id
                        INNER JOIN donation_request
                        ON inventory_id = inventory.id
                        WHERE recipient_id = ${userID}
                        GROUP BY school_name, type, size , status, date`;
  const results = await pool.query(requestQuery);
  const data = results.rows;
  if (request.params.parameter === 'date') {
    const ascFn = (a, b) => new Date(a.date) - new Date(b.date);
    const descFn = (a, b) => new Date(b.date) - new Date(a.date);
    // sorting condition
    data.sort(request.params.sortHow === 'asc' ? ascFn : descFn);
  } else if (request.params.parameter === 'type') {
    data.sort(
      request.params.sortHow === 'asc'
        ? dynamicAscSort('type')
        : dynamicDescSort('type'),
    );
  } else if (request.params.parameter === 'quantity') {
    // sorting condition
    data.sort(
      request.params.sortHow === 'asc'
        ? dynamicAscSort('count')
        : dynamicDescSort('count'),
    );
  }
  response.render('showMyRequests', { data });
};

export {
  pool,
  dynamicAscSort,
  dynamicDescSort,
  sortDonations,
  sortRequests,
};
