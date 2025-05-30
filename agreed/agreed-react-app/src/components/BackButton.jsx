'use client';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button className="btn-custom" onClick={() => navigate(to)}>
      ← Back
    </button>
  );
}
