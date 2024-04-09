import React, { useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import emptybox from '../images/emptybox.png';
import nhaService from '../services/nhaService';
import { useSelector } from 'react-redux';

const sideBarStyle = {
  backgroundColor: "#23262F",
  borderLeftWidth: "medium",
  borderLeftColor: "#076966",
  borderLeftStyle: "solid",
  borderRadius: "14px",
  overflowY: "scroll",
  scrollbarColor: "#076966 #1A1C23",
  scrollbarWidth: "thin",
};

const dateAndTimeConversion = (date) => {
  const dateObject = new Date(date);
  const string = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });
  return string;
};

const dateConversion = (date) => {
  const dateObject = new Date(date);
  const string = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return string;
};

const loadInputAndTranslatedCode = (setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, inputCode, translatedCode, sourceLanguage, desiredLanguage) => {
  setInputCode(inputCode);
  setTranslatedCode(translatedCode);
  setSourceLanguage(sourceLanguage); // Set the source language dropdown value
  setDesiredLanguage(desiredLanguage); // Set the desired language dropdown value
}

const History = ({ setTriggerHistory, triggerHistory, user, showSidebar, toggleSidebar, setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage }) => {
  const dbUserFromRedux = useSelector((state) => state.user.dbUser);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const [history, setHistoryData] = useState(null);
  const [historyError, setHistoryError] = useState('');

  const handleGetAllHistory = async () => {
    setHistoryError(''); //reset history error before getting
    try {
      // throw new Error('Simulated error: getallhistory');
      setHistoryData(await nhaService.getAllHistory(user, dbUserFromRedux, ascend, sortField));
      setFilteredHistory(history);
      console.log("spingus bingus");
    }
    catch (error) {
      // console.log(error);
      setHistoryError('Unable to retrieve history at this time.');
    }
  };

  useEffect(() => {
    if (user !== null || triggerHistory) {
      // console.log("yeet");
      handleGetAllHistory();
      setTriggerHistory(false);
      setFilteredHistory(history);
    }
  }, [user, triggerHistory])

  useEffect(() => {
    setSortField("");
    setAscend(-1);
    setFilterField("");
    setFilteredHistory(history);
    setFilterOptions([]);
  }, [showSidebar])

  const [ascend, setAscend] = useState(-1);

  const [sortField, setSortField] = useState("");
  const changeSort = (e) => {
    setSortField(e.target.value);
    setTriggerHistory(true);
  }

  const [filterField, setFilterField] = useState("");
  const changeFilter = (e) => {
    setFilterField(e.target.value);
    changeFilterOptions(e.target.value);
  }

  const [filterOptions, setFilterOptions] = useState([]);
  const changeFilterOptions = (filter) => {
    const objects = new Set();
    if (filter === "Date") {
      history.forEach((element) => {
        objects.add(dateConversion(element.createdAt));
      })
    }
    else if (filter === "Source") {
      history.forEach((element) => {
        objects.add(element.Source_language);
      })
    }
    else if (filter === "Destination") {
      history.forEach((element) => {
        objects.add(element.Desired_language);
      })
    }
    setFilterOptions(Array.from(objects));
  }

  // const [selectedFilterItem, setSelectedFilterItem] = useState("");
  const [filteredHistory, setFilteredHistory] = useState(null)
  const changeSelectedFilterItem = (e) => {
    // setSelectedFilterItem(e.target.value);
    const filterItem = e.target.value;
    var newHist = [];
    if (filterField === "Date") {
      history.forEach((element) => {
        const date = dateConversion(element.createdAt);
        if (date === filterItem) newHist.push(element);
      })
    }
    else if (filterField === "Source") {
      history.forEach((element) => {
        newHist.push(element.Source_language);
      })
    }
    else if (filterField === "Destination") {
      history.forEach((element) => {
        newHist.push(element.Desired_language);
      })
    }
    console.log(newHist);
    setFilteredHistory(newHist);
    
  }

  if (history === null || filteredHistory === null || showSidebar === false) return (<></>);
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
          <button id="closeHistory" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faX} size="2x" id="xIcon" />
          </button>
        </div>

        {historyError !== '' || history == null ? (
          <div className="historyError">
            <h1 className="errorText">{historyError}</h1>
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="emptyHistory">
                <img id="emptyPicture" src={emptybox} alt="History empty" style={{ width: '70%', height: '70%' }} />
                <a href="https://www.freepik.com/icons/empty" target="_blank" rel="noopener noreferrer" className="link" id="emptyCredit">Icon by Ghozi Muhtarom</a>
                <h1 id="emptyText">No past translations</h1>
              </div>
            ) : (
              <>
                <div className="historyOptions">
                  <div className="sortAndFilter">
                    {/* sort asc/desc */}
                    <button>
                      <FontAwesomeIcon id="ascdsc" icon={ascend === 1 ? faArrowUp : faArrowDown} onClick={() => { setAscend(ascend * -1); setTriggerHistory(true); }} />
                    </button>

                    {/* sort by */}
                    <select id="sort" onChange={changeSort}>
                      <option value=""> Sort By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>

                    {/* filter by */}
                    <select id="filter" onChange={changeFilter}>
                      <option value=""> Filter By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>
                  </div>

                  {/* filter options */}
                  <select id="filterOptions" onChange={changeSelectedFilterItem}>
                    <option value=""> Select Filter... </option>
                    {filterOptions.map((item, index) => (
                      <option value={item} key={index}> {filterOptions[index]} </option>
                    ))}
                  </select>

                  {/* clear all history */}
                  <button id="clearAll" className="ripple">Clear all history</button>
                </div>

            <div>
              {filteredHistory.map((historyLabel, i) => (
                <div className="translationHistory" key={i}>
                  <h4>
                    {dateAndTimeConversion(filteredHistory[i].createdAt)}
                  </h4>

                      <div className="codeHistory">

                    <div className="entrySource">
                      <h5>
                        Source Code ({filteredHistory[i].Source_language})
                      </h5>
                      <p>
                        {filteredHistory[i].original_code}
                      </p>
                    </div>

                    <div className="entryDest">
                      <h5>
                        Converted Code ({filteredHistory[i].Desired_language})
                      </h5>
                      <p>
                        {filteredHistory[i].converted_code}
                      </p>
                    </div>
                  </div>

                      <div className="historyEntryOptions">
                        {/* <button id="translateAgain" onClick={() => loadInputAndTranslatedCode(setInputCode, setTranslatedCode, history[i].original_code, history[i].converted_code)}> Translate again </button> */}
                        <button id="translateAgain" onClick={() => loadInputAndTranslatedCode(setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, history[i].original_code, history[i].converted_code, history[i].Source_language, history[i].Desired_language)}> Translate again </button>
                        <button id="removeEntry" title="Remove translation">
                          <FontAwesomeIcon id="trashIcon" icon={faTrashCan} size="2x" />
                        </button>
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
      );
}

      export default History