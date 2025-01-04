interface EmptyContentProps {
  message: string;
}
export default function EmptyContent({ message }: EmptyContentProps) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
