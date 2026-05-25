const CompletionBadge = ({ percent }) => {
  if (percent < 100) return null;

  return (
    <span className="ml-2 px-2 py-1 text-sm bg-orange-500 text-white rounded">
      🔥 100% Completed
    </span>
  );
};

export default CompletionBadge;
