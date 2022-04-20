import pool from "../initPool.js";

class RoomService {
  constructor() {
    this.pool = pool;
  }

  // getRoomByName(roomName) {
  //   this.pool.query("SELECT * FROM rooms WHERE name=$1", [
  //     roomName,
  //   ]).then((resp) => {
  //     return resp.rows.length === 0 ? null : resp.rows[0];

  //   });
  // }
  async getRoomByName(roomName) {
    try {
      const resp = await this.pool.query("SELECT * FROM rooms WHERE name=$1", [
        roomName,
      ]);
      return resp.rows.length === 0 ? null : resp.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  async createRoom(roomName) {
    try {
      const resp = await this.pool.query(
        "INSERT INTO rooms (name) VALUES ($1) RETURNING *",
        [roomName]
      );
      return resp.rows.length === 0 ? null : resp.rows[0];
    } catch (err) {
      console.error(err);
    }
  }
}

export default RoomService;