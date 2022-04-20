import pool from '../initPool.js';

class MessageService {
  constructor() {
    this.pool = pool;
  }

  async listMessagesByRoom(roomId) {
    try {
      const resp = await this.pool.query('SELECT * FROM messages WHERE roomId=$1', [
        roomId,
      ]);
      return resp.rows.length === 0 ? [] : resp.rows;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createMessage(roomId, sender, message) {
    try {
      const resp = await this.pool.query(
        'INSERT INTO messages (roomId, sender, message) VALUES ($1, $2, $3) RETURNING *',
        [roomId, sender, message],
      );
      return resp.rows.length === 0 ? null : resp.rows[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default MessageService;
