const Progress = ({
  title,
  percentage,
}: {
  title: string;
  percentage: number;
}) => {
  const safePercentage = percentage || 0;

  return (
    <div className="flex gap-2 mt-4 flex-col">
      <span className="font-medium text-base">{title}</span>
      <div className="flex items-center gap-2">
        <div className="w-full h-5 bg-titan-white rounded-full">
          <div
            className="w-full h-5 bg-cornflower-blue rounded-full"
            style={{ width: `${Math.min(safePercentage, 100)}%` }}
          ></div>
        </div>
        <span className="font-medium text-sm">
          {safePercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
export default Progress;
