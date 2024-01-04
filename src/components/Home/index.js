import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsList from '../ProjectsList'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    projectList: [],
    apiStatus: apiStatusConstant.initial,
    selectOption: 'ALL',
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const {selectOption} = this.state
    const options = {
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${selectOption}`,
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onChangeOptions = event => {
    this.setState(
      {
        selectOption: event.target.value,
      },
      this.getProjectsList,
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#475569" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectList} = this.state
    return (
      <div className="success-container">
        <ul className="un-order-list-project">
          {projectList.map(eachProject => (
            <ProjectsList details={eachProject} key={eachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="button-retry"
        type="button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectOption} = this.state
    return (
      <>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-image"
          />
        </nav>
        <div className="main-container">
          <ul className="select-option-container">
            <select
              value={selectOption}
              onChange={this.onChangeOptions}
              className="select"
            >
              {categoriesList.map(eachOption => (
                <option value={eachOption.id} key={eachOption.id}>
                  {eachOption.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderViewBasedOnApiStatus()}
        </div>
      </>
    )
  }
}

export default Home
