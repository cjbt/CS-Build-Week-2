const express = require('express');
const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await db('node');
    const reducer = (acc, val) => {
      acc[val.room_id] = val;
      return acc;
    };
    const initialObject = {};
    const obj = data.reduce(reducer, initialObject);
    res.status(200).json(obj);
  } catch ({ message }) {
    console.error(message);
    res.status(500).json({ message });
  }
});

router.post('/', async (req, res) => {
  const {
    room_id,
    title,
    description,
    coordinates,
    exits,
    cooldown,
    errors,
    messages
  } = req.body;
  if (
    !room_id ||
    !title ||
    !description ||
    !coordinates ||
    !exits ||
    !cooldown ||
    !errors ||
    !messages
  ) {
    res.status(422).json({ message: 'missing fields required' });
  }

  const exitObj = {};
  exits.forEach(item => (exitObj[item] = '?'));

  try {
    const data = await db('node').insert({
      room_id,
      title,
      description,
      coordinates: JSON.stringify(coordinates),
      exits: exitObj,
      cooldown,
      errors: JSON.stringify(errors),
      messages: JSON.stringify(messages)
    });
    console.log(data);
    res.status(201).json({ message: 'node has been created' });
  } catch ({ message }) {
    console.error(message);
    res.status(500).json({ message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    room_id,
    title,
    description,
    coordinates,
    exits,
    cooldown,
    errors,
    messages
  } = req.body;
  if (
    !room_id ||
    !title ||
    !description ||
    !coordinates ||
    !exits ||
    !cooldown ||
    !errors ||
    !messages
  ) {
    res.status(422).json({ message: 'missing fields required' });
  }
  try {
    await db('node')
      .where({ room_id: id })
      .update({
        room_id,
        title,
        description,
        coordinates: JSON.stringify(coordinates),
        exits: JSON.stringify(exits),
        cooldown,
        errors: JSON.stringify(errors),
        messages: JSON.stringify(messages)
      });
    res.status(200).json({ message: 'node changed' });
  } catch ({ message }) {
    console.error(message);
    res.status(500).json({ message });
  }
});

router.delete('/:room_id', async (req, res) => {
  const { room_id } = req.params;
  try {
    await db('node')
      .where({ room_id })
      .del();
    res.status(200).json({ message: `node has been deleted` });
  } catch ({ message }) {
    console.error(message);
    res.status(500).json({ message });
  }
});

module.exports = router;
