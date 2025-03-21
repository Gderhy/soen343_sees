import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/supabase/supabase";
import "./CreateEvent.css";

interface Stakeholder {
  id: string;
  fullName: string;
}

// Temporary mock — replace with your fetch call later
const mockStakeholders: Stakeholder[] = [
  { id: "stake1", fullName: "Stakeholder One" },
  { id: "stake2", fullName: "Stakeholder Two" },
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [allStakeholders, setAllStakeholders] = useState<Stakeholder[]>([]);
  const [filteredStakeholders, setFilteredStakeholders] = useState<Stakeholder[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<Stakeholder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: replace with real fetch from your backend
    setAllStakeholders(mockStakeholders);
    setFilteredStakeholders(mockStakeholders);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFilteredStakeholders(
      allStakeholders.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) &&
          !selectedStakeholders.some((sel) => sel.id === s.id)
      )
    );
  };

  const addStakeholder = (stake: Stakeholder) => {
    setSelectedStakeholders([...selectedStakeholders, stake]);
    setSearch("");
    setFilteredStakeholders(allStakeholders.filter((s) => s.id !== stake.id));
  };

  const removeStakeholder = (id: string) =>
    setSelectedStakeholders(selectedStakeholders.filter((s) => s.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stakeholderIds = selectedStakeholders.map((s) => s.id);

    const { data, error } = await createEvent(title, description, date, location);
    if (error) {
      console.error(error);
      return;
    }

    console.log("Stakeholders to attach:", stakeholderIds);
    navigate(`/event/${data.id}`);
  };

  return (
    <div className="container">
      <h2>Create an Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>Stakeholders</label>
        <div className="stakeholder-input-wrapper">
          <div className="chips">
            {selectedStakeholders.map((s) => (
              <span key={s.id} className="chip">
                {s.fullName}{" "}
                <button type="button" onClick={() => removeStakeholder(s.id)}>
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add stakeholder…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {search && filteredStakeholders.length > 0 && (
            <ul className="suggestions">
              {filteredStakeholders.map((s) => (
                <li key={s.id} onClick={() => addStakeholder(s)}>
                  {s.fullName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
