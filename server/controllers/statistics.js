import db from '../database/database.js';
import { updateStats } from '../remote/gameLogic.js';

export async function statisticsAll(request, reply) {
  const stat = db
    .prepare(
      `SELECT
    game.id AS game_id,
    game.challenge_id,
    game.win_user_id,
    COALESCE(winner.username, 'AI') AS winner_username,
    game.win_score AS winner_score,
    game.losses_user_id,
    COALESCE(loser.username, 'AI') AS loser_username,
    game.lose_score AS loser_score,
    game.date
  FROM game
  LEFT JOIN users AS winner ON game.win_user_id = winner.id
  LEFT JOIN users AS loser ON game.losses_user_id = loser.id`
    )
    .all();
  return reply.code(200).send({ stat });
}

export async function statisticsUser(req, reply) {
  const { username } = req.body;

  try {
    const statUser = db
      .prepare(
        `SELECT
          g.win_score,
          COALESCE(winner.username, 'AI') AS winner_name,
          g.lose_score,
          COALESCE(loser.username, 'AI') AS loser_name,
          g.date
      FROM users u
      JOIN game g ON g.win_user_id = u.id OR g.losses_user_id = u.id
      LEFT JOIN users AS winner ON g.win_user_id = winner.id
      LEFT JOIN users AS loser ON g.losses_user_id = loser.id
      WHERE u.username = ?
      `
      )
      .all(username);

    return reply.code(200).send({ statUser });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function win(req, reply) {
  try {
    let gameEND = { changes: 0 };
    if (challenge_id) {
      gameEND = db
      .prepare(
        `UPDATE game SET win_user_id = ?, win_score = ?, date = ? WHERE challenge_id = ? `
      )
      .run(user_id, score, new Date().toISOString(), challenge_id);
      db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run( challenge_id)
    }
    if (!challenge_id || gameEND.changes === 0) {
      gameEND = db
      .prepare(
        `INSERT INTO game (win_user_id, win_score, date) VALUES (?,?,?)`
        )
        .run(user_id, score, new Date().toISOString());
    }
    const winUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);
    const winValue = winUser.wins + 1;
    const updateWins = db
      .prepare(`UPDATE users SET wins = ? WHERE id = ?`)
      .run(winValue, user_id);
    return reply.code(200).send({ updateWins, gameEND });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function loseUser(req, reply) {
  const { user_id, challenge_id } = req.body;

  try {
    let gameEND = { changes: 0 };
    if (challenge_id) {
      gameEND = db
        .prepare(
          `UPDATE game SET losses_user_id = ?, lose_score = ?, date = ? WHERE challenge_id = ? `
        )
        .run(user_id, score, new Date().toISOString(), challenge_id);
      db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run( challenge_id)
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
export async function opponentStats(req, reply) {
  const userId = Number(req.params.user_id || req.body?.user_id || req.query.user_id);
  try {
    const rows = db
      .prepare(
        `SELECT COALESCE(u.username, 'AI') AS username, t.opponent_id, t.wins, t.losses, t.wins + t.losses AS games
         FROM (
           SELECT
             CASE WHEN win_user_id = ? THEN losses_user_id ELSE win_user_id END AS opponent_id,
             SUM(CASE WHEN win_user_id = ? THEN 1 ELSE 0 END) AS wins,
             SUM(CASE WHEN losses_user_id = ? THEN 1 ELSE 0 END) AS losses
           FROM game
           WHERE win_user_id = ? OR losses_user_id = ?
           GROUP BY opponent_id
         ) t
         LEFT JOIN users u ON u.id = t.opponent_id
         ORDER BY games DESC`
      )
      .all(userId, userId, userId, userId, userId);
    return reply.code(200).send({ stats: rows });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function aiResult(req, reply) {
  const { user_id, player_score, ai_score, player_won } = req.body;
  try {
    const winnerId = player_won ? user_id : 0;
    const loserId = player_won ? 0 : user_id;
    const winnerScore = player_won ? player_score : ai_score;
    const loserScore = player_won ? ai_score : player_score;

    updateStats(winnerId, loserId, winnerScore, loserScore);

    return reply.code(200).send({ status: 'ok' });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
