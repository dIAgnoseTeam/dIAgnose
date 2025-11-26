const RegisterCard = ({ title, content }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-full flex flex-col">
      <p className="font-bold text-blue-900 mb-2">{title}</p>
      <p className="text-gray-700 flex-1">{content}</p>
    </div>
  );
};

export default RegisterCard;
