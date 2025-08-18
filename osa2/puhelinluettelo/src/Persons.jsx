const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(person => (
      <p key={person.name}>{person.name} {person.number}<button onClick={() => onDelete(person.id, person.name)}>delete</button></p>
    ))}
  </div>
)

export default Persons