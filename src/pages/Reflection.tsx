import { useNavigate } from "react-router-dom";
import { ReflectionResults } from "@/components/ReflectionResults";
import { useAppContext } from "@/context/AppContext";

export default function Reflection() {
  const navigate = useNavigate();
  const {
    selectedAnswers,
    personalThoughts,
    setSelectedAnswers,
    setPersonalThoughts,
    setJournalEntry,
  } = useAppContext();

  const handleStartJournal = () => {
    navigate("/journal");
  };

  const handleStartOver = () => {
    setSelectedAnswers([]);
    setPersonalThoughts("");
    setJournalEntry("");
    navigate("/");
  };

  return (
    <ReflectionResults
      selectedAnswers={selectedAnswers}
      personalThoughts={personalThoughts}
      onJournal={handleStartJournal}
      onStartOver={handleStartOver}
    />
  );
}
