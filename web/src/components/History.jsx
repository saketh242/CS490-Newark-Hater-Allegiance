import React, { useState, useEffect } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faX, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import emptybox from '../images/emptybox.png'
import nhaService from '../services/nhaService'

const sideBarStyle = {
  backgroundColor: "#23262F",
  borderLeftWidth: "medium",
  borderLeftColor: "#076966",
  borderLeftStyle: "solid",
  borderRadius: "14px",
  overflowY: "scroll",
  scrollbarColor: "#076966 #1A1C23",
  scrollbarWidth: "thin",
}

const formatDate = (date, includeTime = true) => {
  const dateObject = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: includeTime ? 'numeric' : undefined,
    minute: includeTime ? 'numeric' : undefined,
    timeZoneName: includeTime ? 'short' : undefined
  };
  return dateObject.toLocaleDateString('en-US', options)
}

const loadInputAndTranslatedCode = (setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, inputCode, translatedCode, sourceLanguage, desiredLanguage) => {
  setInputCode(inputCode)
  setTranslatedCode(translatedCode)
  setSourceLanguage(sourceLanguage)
  setDesiredLanguage(desiredLanguage)
}

const History = ({ setTriggerHistory, triggerHistory, user, dbUserRedux, showSidebar, toggleSidebar, setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage }) => {

  const [width, setWidth] = useState(window.innerWidth)
  const [originalHistory, setOriginalHistory] = useState(null)
  const [history, setHistoryData] = useState(null)
  const [historyError, setHistoryError] = useState('')
  const [sortOrder, setSortOrder] = useState(-1)
  const [sortField, setSortField] = useState("")
  const [filterField, setFilterField] = useState("")
  const [filterOptions, setFilterOptions] = useState([])
  const [selectedItem, setSelectedFilterItem] = useState("")

  const changeSort = (e) => {
    setSortField(e.target.value)
  }

  const changeFilter = (e) => {
    setSelectedFilterItem("")
    setFilterField(e.target.value)
    changeFilterOptions(e.target.value)
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => {
    const handleGetAllHistory = async () => {
      setHistoryError('')
      try {
        const fetchedHistory = await nhaService.getAllHistory(user, dbUserRedux)
        setOriginalHistory(fetchedHistory)
        setHistoryData(fetchedHistory)
      } catch (error) {
        setHistoryError('Unable to retrieve history at this time.')
      }
    }

    if (triggerHistory) {
      handleGetAllHistory();
      setTriggerHistory(false);
    }
  }, [user, dbUserRedux, triggerHistory, setTriggerHistory])

  useEffect(() => {
    setSortField("")
    setSortOrder(-1)
    setFilterField("")
    setSelectedFilterItem("")
    setFilterOptions([])
  }, [showSidebar])

  const changeFilterOptions = (filter) => {
    const objects = new Set()
    originalHistory.forEach((element) => {
      if (filter === "Date") {
        objects.add(formatDate(element.createdAt, false))
      } else if (filter === "Source") {
        objects.add(element.Source_language)
      } else if (filter === "Destination") {
        objects.add(element.Desired_language)
      }
    });
    setFilterOptions(Array.from(objects))
  };

  const changeSelectedFilterItem = (e) => {
    const selectedValue = e.target.value
    setSortOrder(-1)
    if (selectedValue === "") {
      setHistoryData(originalHistory)
    } else {
      const filteredHistory = originalHistory.filter((item) => {
        if (filterField === "Date") {
          return formatDate(item.createdAt, false) === selectedValue
        } else if (filterField === "Source") {
          return item.Source_language === selectedValue
        } else if (filterField === "Destination") {
          return item.Desired_language === selectedValue
        }
        return true;
      })
      setHistoryData(filteredHistory)
    }
    setSelectedFilterItem(selectedValue)
  }

  useEffect(() => {
    const sortByDate = (a, b) => {
      return sortOrder === 1 ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)
    }

    const sortBySource = (a, b) => {
      return sortOrder === 1 ? a.Source_language.localeCompare(b.Source_language) : b.Source_language.localeCompare(a.Source_language)
    }

    const sortByDestination = (a, b) => {
      return sortOrder === 1 ? a.Desired_language.localeCompare(b.Desired_language) : b.Desired_language.localeCompare(a.Desired_language)
    }

    if (history !== null && sortOrder !== 0) {
      let sortedHistory = [...history]

      if (sortField === "Date" || sortField === "") {
        sortedHistory.sort(sortByDate)
      } else if (sortField === "Source") {
        sortedHistory.sort(sortBySource)
      } else if (sortField === "Destination") {
        sortedHistory.sort(sortByDestination)
      }

      setHistoryData(sortedHistory);
    }
    // the line below is because react wants history to be in the dependency array, but that causes infinite re-renders as we set history data above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, sortField])

  if (showSidebar === false) return (<></>)
  return (
    <>
      <Drawer
        open={showSidebar}
        onClose={toggleSidebar}
        direction='right'
        size={width * 0.33}
        style={sideBarStyle}
      >
        <div className="historyTop">
          <h1 className="translationTitle"> Translation History </h1>
          <button id="closeHistory" onClick={toggleSidebar}><FontAwesomeIcon icon={faX} size="2x" id="xIcon" /></button>
        </div>

        {historyError !== '' || history == null ? (
          <div className="historyError" data-testid="historyError">
            <h1 className="errorText">{historyError}</h1>
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="emptyHistory">
                <img id="emptyPicture" src={emptybox} alt="History empty" style={{ width: '70%', height: '70%' }} loading="lazy" />
                <a href="https://www.freepik.com/icons/empty" target="_blank" rel="noopener noreferrer" className="link" id="emptyCredit">Icon by Ghozi Muhtarom</a>
                <h1 id="emptyText">No past translations</h1>
              </div>
            ) : (
              <>
                <div className="historyOptions">
                  <div className="sortAndFilter">
                    {/* sort asc/desc */}
                    <button>
                      <FontAwesomeIcon id="ascdsc" icon={sortOrder === 1 ? faArrowUp : faArrowDown} onClick={() => setSortOrder(sortOrder * -1)} />
                    </button>

                    {/* sort by */}
                    <select id="sort" onChange={changeSort}>
                      <option value=""> Sort By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>

                    <select id="filter" onChange={changeFilter}>
                      <option value=""> Filter By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>

                    <select id="filterOptions" onChange={changeSelectedFilterItem} value={selectedItem}>
                      <option value=""> Select Filter... </option>
                      {filterOptions.map((item, index) => (
                        <option value={item} key={index}> {filterOptions[index]} </option>
                      ))}
                    </select>
                  </div>

                  <button id="clearAll" className="ripple">Clear all history</button>
                </div>

                <div>
                  {history.map((historyLabel, i) => (
                    <div className="translationHistory" key={i}>
                      <h4>{formatDate(history[i].createdAt, true)}</h4>

                      <div className="codeHistory">
                        <div className="entrySource">
                          <h5>Source Code ({history[i].Source_language})</h5>
                          <p>{history[i].original_code}</p>
                        </div>

                        <div className="entryDest">
                          <h5>Converted Code ({history[i].Desired_language})</h5>
                          <p>{history[i].converted_code}</p>
                        </div>
                      </div>

                      <div className="historyEntryOptions">
                        <button data-testid="translateAgain" id="translateAgain" onClick={() => loadInputAndTranslatedCode(setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, history[i].original_code, history[i].converted_code, history[i].Source_language, history[i].Desired_language)}>Translate again</button>
                        <button id="removeEntry" title="Remove translation"><FontAwesomeIcon id="trashIcon" icon={faTrashCan} size="2x" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  )
}

export default History
