import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import ProjectCard from '../ProjectCard'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    projectsDataList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  onChangeSelectElement = event => {
    this.setState({activeCategoryId: event.target.value}, this.getProjectsData)
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategoryId} = this.state

    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(projectsApiUrl, options)

    if (response.ok) {
      const projectsData = await response.json()

      const formattedData = projectsData.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      this.setState({
        projectsDataList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryBtn = () => {
    this.getProjectsData()
  }

  renderProjects = () => {
    const {projectsDataList} = this.state

    return (
      <ul className="project-cards-container">
        {projectsDataList.map(eachProject => (
          <ProjectCard key={eachProject.id} eachProjectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state

    return (
      <>
        <Header />
        <div className="app-container">
          <select
            className="select-element"
            onChange={this.onChangeSelectElement}
            value={activeCategoryId}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderContent()}
        </div>
      </>
    )
  }
}

export default ProjectsShowcase
