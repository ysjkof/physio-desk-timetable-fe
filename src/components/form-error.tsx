import React from "react";

interface IFormErrorProps {
  errorMessage: string;
}

// FC = Functional Component
export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span className="font-medium text-red-500">{errorMessage}</span>
);
