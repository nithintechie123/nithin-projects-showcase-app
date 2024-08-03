import './index.css'

const ProjectCard = props => {
  const {eachProjectDetails} = props

  const {imageUrl, name} = eachProjectDetails

  return (
    <li className="project-item-container">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectCard
