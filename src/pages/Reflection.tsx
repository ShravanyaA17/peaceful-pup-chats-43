import { useNavigate } from "react-router-dom";
import { ReflectionResults } from "@/components/ReflectionResults";
import { useAppContext } from "@/context/AppContext";

export default function Reflection() {
  const navigate = useNavigate();
  const { selectedAnswers, setSelectedAnswers, setJournalEntry } = useAppContext();

  const handleStartJournal = () => {
    navigate('/journal');
  };

  const handleStartOver = () => {
    setSelectedAnswers([]);
    setJournalEntry("");
    navigate('/');
  };

  return (
    <ReflectionResults 
      selectedAnswers={selectedAnswers}
      onJournal={handleStartJournal}
      onStartOver={handleStartOver}
    />
  );
}