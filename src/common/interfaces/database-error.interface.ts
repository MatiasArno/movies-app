interface DatabaseError extends Error {
  code?: string;
}

export default DatabaseError;
