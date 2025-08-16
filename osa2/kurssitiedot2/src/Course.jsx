const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  for (let i = 0; i < props.parts.length; i++) {
    <Part part={props.parts[i].name} exercises={props.parts[i].exercises} />
  }
  return (
    <div>
      {props.parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
    </div>
  )
}

const Part = (props) => <p>{props.part} {props.exercises}</p>

const Total = (props) => <b>total of {props.total} exercises</b>

const Course = (props) => {
  const yhteensä = props.course.parts.reduce((a, b) => a + b.exercises, 0);
  console.log(yhteensä)
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={yhteensä} />
    </div>
  )
}

export default Course