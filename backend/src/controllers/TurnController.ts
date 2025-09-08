import { Request, Response } from "express";
import { pool } from "../db";

export const getTurns = async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM turns ORDER BY id ASC");
  res.json(result.rows);
};

export const createTurn
 = async (req: Request, res: Response) => {
  const { clientId, date, time } = req.body;
  const result = await pool.query(
    "INSERT INTO turns (clientId, date, time) VALUES ($1, $2, $3) RETURNING *",
    [clientId, date, time]
  );
  res.json(result.rows[0]);
};

export const updateTurn = async (req: Request, res: Response) => {
  const { id, clientId, date, time } = req.body;
  const result = await pool.query(
    "UPDATE turns SET clientId=$1, date=$2, time=$3 WHERE id=$4 RETURNING *",
    [clientId, date, time, id]
  );
  res.json(result.rows[0]);
};

export const deleteTurn = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query("DELETE FROM turns WHERE id=$1", [id]);
  res.json({ deleted: id });
};
