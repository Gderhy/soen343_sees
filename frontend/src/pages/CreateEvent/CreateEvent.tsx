import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";
import { fetchAllStakeholders, createEvent } from "../../services/backend/user";
import { ParticipationType, Stakeholder } from "../../types";

interface ParticipationOptionInterface {
  value: ParticipationType;
  label: string;
};

const participatonOptions: ParticipationOptionInterface[] = [
  { value: "public", label: "Public (Anyone can join)" },
  { value: "university", label: "University-only" },
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDatetime, setEventDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [participation, setParticipation] = useState("public");

  const [allStakeholders, setAllStakeholders] = useState<Stakeholder[]>([]);
  const [filteredStakeholders, setFilteredStakeholders] = useState<Stakeholder[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<Stakeholder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStakeholders = async () => {
      const { data, error } = await fetchAllStakeholders();
      if (error) {
        console.error(error);
        return;
      }

      setAllStakeholders(data);
      setFilteredStakeholders(data);
    };

    fetchStakeholders();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFilteredStakeholders(
      allStakeholders.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) &&
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

    const { data, error } = await createEvent(
      title,
      description,
      eventDatetime,
      location,
      basePrice,
      participation,
      stakeholderIds
    );
    if (error) {
      console.error(error);
      return;
    }
    navigate(`/event/${data}`);
  };

  return (
    <div className="create-event-container">
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
        <input
          type="datetime-local"
          value={eventDatetime}
          onChange={(e) => setEventDatetime(e.target.value)}
          required
        />
        <input //TODO: Implement google map search or something similar to get the location will help with event promotion and targetting
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
                {s.full_name}{" "}
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
                  {s.full_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <label>Base Price $</label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          required
        />
        <label>Participation</label>
        <select value={participation} onChange={(e) => setParticipation(e.target.value)}>
          {participatonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
