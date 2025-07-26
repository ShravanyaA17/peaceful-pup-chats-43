import { useNavigate } from "react-router-dom";
import { JournalComplete } from "@/components/JournalComplete";
import { useAppContext } from "@/context/AppContext";

export default function Complete() {
  const navigate = useNavigate();
  const { setSelectedAnswers, setJournalEntry } = useAppContext();

  const handleStartOver = () => {
    setSelectedAnswers([]);
    setJournalEntry("");
    navigate('/');
  };

  return <JournalComplete onStartOver={handleStartOver} />;
}