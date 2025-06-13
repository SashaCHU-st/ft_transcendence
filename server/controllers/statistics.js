import db from '../database/database.js';

export async function statisticsAll(request, reply) {
  const stat = db
    .prepare(
      `SELECT 
    game.id AS game_id,
    game.challenge_id,
    game.win_user_id,
    winner.name AS winner_name,
    game.losses_user_id,
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
  const { user_id } = req.body;

  try {
    const statUser = db
      .prepare(
        `SELECT 
        users.id,
        users.wins,
        users.losses,
        game.id AS game_id,
        game.date
        FROM users
        LEFT JOIN game
        ON users.id = game.win_user_id OR users.id = game.losses_user_id
        WHERE users.id = ?`
      )
      .all(user_id);
    console.log('USER STAT =>', statUser);

    // const wins = statUser.wins;
    // const losses = statUser.losses;

    return reply.code(200).send({ statUser });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function win(req, reply) {
  console.log('WE IN WIN');

  const { user_id, challenge_id } = req.body;

  console.log("UUUUUUUUUUUUU=>", challenge_id)
  console.log("ttttttttt=>", user_id)
  try {
    // const challenge_id = challenge_id;
    const gameEND = db
      .prepare(
        `UPDATE game SET win_user_id = ?, date = ? WHERE challenge_id = ? `
      )
      .run(user_id, new Date().toISOString(), challenge_id);
    console.log('JJJJJJ=>', gameEND);
    if (gameEND.changes !== 0) {
      const winUser = db
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .get(user_id);

      const winValue = winUser.wins + 1;
      const updateWins = db
        .prepare(`UPDATE users SET wins = ? WHERE id = ?`)
        .run(winValue, user_id);
      return reply.code(200).send({ updateWins, gameEND });
    } else {
      return reply.code(400).send({ message: 'We are not in game' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function loseUser(req, reply) {
  const { user_id, challenge_id } = req.body;

  try {
    // const challenge_id = 1;
    const gameEND = db
      .prepare(
        `UPDATE game SET losses_user_id = ?, date = ? WHERE challenge_id = ? `
      )
      .run(user_id, new Date().toISOString(), challenge_id);
    if (gameEND.changes !== 0) {
      const loseUser = db
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .get(user_id);

      const count = loseUser.losses + 1;
      const updateLoses = db
        .prepare(`UPDATE users SET losses = ? WHERE id = ?`)
        .run(count, user_id);

      return reply.code(200).send({ updateLoses, gameEND });
    } else {
      return reply.code(400).send({ message: 'We are not in game' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
