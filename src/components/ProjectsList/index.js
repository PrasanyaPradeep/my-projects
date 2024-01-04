import './index.css'

const ProjectsList = props => {
  const {details} = props
  const {name, imageUrl} = details

  return (
    <li className="project-list">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectsList
