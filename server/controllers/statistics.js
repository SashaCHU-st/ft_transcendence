import db from '../database/database.js';

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
// <<<<<<< HEAD
//         `SELECT 
//         users.id,
//         users.wins,
//         users.losses,
//         game.id AS game_id,
//         game.date
//         FROM users
//         LEFT JOIN game
//         ON users.id = game.win_user_id OR users.id = game.losses_user_id
//         WHERE users.id = ?`
// =======
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
  console.log('WE IN WIN');

// <<<<<<< HEAD
//   const { user_id, challenge_id } = req.body;

//   console.log("UUUUUUUUUUUUU=>", challenge_id)
//   console.log("ttttttttt=>", user_id)
//   try {
//     // const challenge_id = challenge_id;
//     const gameEND = db
//       .prepare(
//         `UPDATE game SET win_user_id = ?, date = ? WHERE challenge_id = ? `
//       )
//       .run(user_id, new Date().toISOString(), challenge_id);
//     console.log('JJJJJJ=>', gameEND);
//     if (gameEND.changes !== 0) {
//       const winUser = db
//         .prepare(`SELECT * FROM users WHERE id = ?`)
//         .get(user_id);

//       const winValue = winUser.wins + 1;
//       const updateWins = db
//         .prepare(`UPDATE users SET wins = ? WHERE id = ?`)
//         .run(winValue, user_id);
//       return reply.code(200).send({ updateWins, gameEND });
//     } else {
//       return reply.code(400).send({ message: 'We are not in game' });
//     }
// =======
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
// <<<<<<< HEAD
//     // const challenge_id = 1;
//     const gameEND = db
//       .prepare(
//         `UPDATE game SET losses_user_id = ?, date = ? WHERE challenge_id = ? `
//       )
//       .run(user_id, new Date().toISOString(), challenge_id);
//     if (gameEND.changes !== 0) {
//       const loseUser = db
//         .prepare(`SELECT * FROM users WHERE id = ?`)
//         .get(user_id);

//       const count = loseUser.losses + 1;
//       const updateLoses = db
//         .prepare(`UPDATE users SET losses = ? WHERE id = ?`)
//         .run(count, user_id);

//       return reply.code(200).send({ updateLoses, gameEND });
//     } else {
//       return reply.code(400).send({ message: 'We are not in game' });
// =======
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
        `SELECT u.username AS username, t.opponent_id, t.wins, t.losses, t.wins + t.losses AS games
         FROM (
           SELECT
             CASE WHEN win_user_id = ? THEN losses_user_id ELSE win_user_id END AS opponent_id,
             SUM(CASE WHEN win_user_id = ? THEN 1 ELSE 0 END) AS wins,
             SUM(CASE WHEN losses_user_id = ? THEN 1 ELSE 0 END) AS losses
           FROM game
           WHERE win_user_id = ? OR losses_user_id = ?
           GROUP BY opponent_id
         ) t
         JOIN users u ON u.id = t.opponent_id
         ORDER BY games DESC`
      )
      .all(userId, userId, userId, userId, userId);
    db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run(chId)
    return reply.code(200).send({ stats: rows });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
