import { Request, Response } from "express";
import { pool } from "../db";

export const getClients = async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM clients ORDER BY id ASC");
  res.json(result.rows);
};

export const createClient = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const result = await pool.query(
    "INSERT INTO clients (firstName, lastName, email) VALUES ($1, $2, $3) RETURNING *",
    [firstName, lastName, email]
  );
  res.json(result.rows[0]);
};

export const updateClient = async (req: Request, res: Response) => {
  const { id, firstName, lastName, email } = req.body;
  const result = await pool.query(
    "UPDATE clients SET firstName=$1, lastName=$2, email=$3 WHERE id=$4 RETURNING *",
    [firstName, lastName, email, id]
  );
  res.json(result.rows[0]);
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query("DELETE FROM clients WHERE id=$1", [id]);
  res.json({ deleted: id });
};
