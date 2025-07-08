import db from '../database/database.js';

export async function allUsers(request, reply) {
  try {
    const rows = db.prepare('SELECT * FROM users').all();
    const games = db
      .prepare(
        `SELECT 
          g.id AS game_id,
          g.date,
          g.win_score,
          g.lose_score,
          winner.username AS winner_name,
          loser.username AS loser_name
        FROM game g
        LEFT JOIN users winner ON g.win_user_id = winner.id
        LEFT JOIN users loser ON g.losses_user_id = loser.id
        ORDER BY g.date DESC;
        `
      )
      .all();
    return reply.code(200).send({ users: rows, game: games });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return reply.code(500).send({ message: 'Failed to fetch users' });
  }
}
