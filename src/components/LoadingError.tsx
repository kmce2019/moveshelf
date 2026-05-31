export function LoadingError({ loading, error }: { loading?: boolean; error?: string }) {
  if (loading) return <p className="notice">Loading...</p>;
  if (error) return <p className="notice error">{error}</p>;
  return null;
}
