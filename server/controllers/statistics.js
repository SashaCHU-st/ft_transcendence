import db from '../database/database.js';
import { updateStats } from '../remote/gameLogic.js';

export async function statisticsAll(request, reply) {
  const stat = db
    .prepare(
      `SELECT
        game.id AS game_id,
        game.challenge_id,
        game.win_user_id,
        game.win_score,
        winner.name AS winner_name,
        game.losses_user_id,
        game.lose_score,
        loser.name AS loser_name,
        game.date
      FROM game
      INNER JOIN users AS winner ON game.win_user_id = winner.id
      INNER JOIN users AS loser ON game.losses_user_id = loser.id`
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
          winner.username AS winner_name,
          g.lose_score,
          loser.username AS loser_name,
          g.date
      FROM users u
      JOIN game g ON g.win_user_id = u.id OR g.losses_user_id = u.id
      JOIN users AS winner ON g.win_user_id = winner.id
      JOIN users AS loser ON g.losses_user_id = loser.id
      WHERE u.username = ?
      `
      )
      .all(username);
    console.log('USER STAT =>', statUser);


    return reply.code(200).send({ statUser });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function win(req, reply) {
  const { user_id, challenge_id, score } = req.body;

  try {
    let gameEND = { changes: 0 };
    if (challenge_id) {
      gameEND = db
      .prepare(
        `UPDATE game SET win_user_id = ?, win_score = ?, date = ? WHERE challenge_id = ? `
      )
      .run(user_id, score, new Date().toISOString(), challenge_id);
      const gameEND2 = db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run( challenge_id)
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
  const { user_id, challenge_id, score } = req.body;

  try {
    let gameEND = { changes: 0 };
    if (challenge_id) {
      gameEND = db
        .prepare(
          `UPDATE game SET losses_user_id = ?, lose_score = ?, date = ? WHERE challenge_id = ? `
        )
        .run(user_id, score, new Date().toISOString(), challenge_id);
 const gameEND2 = db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run( challenge_id)
    }

    if (!challenge_id || gameEND.changes === 0) {
      gameEND = db
        .prepare(
          `INSERT INTO game (losses_user_id, lose_score, date) VALUES (?,?,?)`
        )
        .run(user_id, score, new Date().toISOString());
    }

    const loseUserRow = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);
    const count = loseUserRow.losses + 1;
    const updateLoses = db
      .prepare(`UPDATE users SET losses = ? WHERE id = ?`)
      .run(count, user_id);

    return reply.code(200).send({ updateLoses, gameEND });
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
