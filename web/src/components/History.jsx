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

  const [originalHistory, setOriginalHistory] = useState(null); 
  const [history, setHistoryData] = useState(null); 

  const handleGetAllHistory = async () => {
    try {
      const fetchedHistory = await nhaService.getAllHistory(user, dbUserFromRedux, sortField);
      setOriginalHistory(fetchedHistory); 
      setHistoryData(fetchedHistory); 
      console.log("spingus bingus");
    } catch (error) {
      console.log(error);
      //temporary --> fill with actual handling of failure to obtain history entries
    }
  };

  useEffect(() => {
    if (user !== null || triggerHistory) {
      console.log("yeet");
      handleGetAllHistory();
      setTriggerHistory(false);
    }
  }, [user, triggerHistory]);

  useEffect(() => {
    setSortField("");
    setAscend(-1);
    setFilterField("");
    setSelectedFilterItem("");
    setFilterOptions([]);
  }, [showSidebar]);

  const [ascend, setAscend] = useState(-1);

  const [sortField, setSortField] = useState("");
  const changeSort = (e) => {
    setSortField(e.target.value);
    setTriggerHistory(true);
  };

  const [filterField, setFilterField] = useState("");
  const changeFilter = (e) => {
    setFilterField(e.target.value);
    changeFilterOptions(e.target.value);
  };

  const [filterOptions, setFilterOptions] = useState([]);
  const changeFilterOptions = (filter) => {
    const objects = new Set();
    if (filter === "Date") {
      originalHistory.forEach((element) => {
        objects.add(dateConversion(element.createdAt));
      });
    } else if (filter === "Source") {
      originalHistory.forEach((element) => {
        objects.add(element.Source_language);
      });
    } else if (filter === "Destination") {
      originalHistory.forEach((element) => {
        objects.add(element.Desired_language);
      });
    }
    setFilterOptions(Array.from(objects));
  };

  const [selectedFilterItem, setSelectedFilterItem] = useState("");
  const changeSelectedFilterItem = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setHistoryData(originalHistory);
    } else {
      const filteredHistory = originalHistory.filter((item) => {
        if (filterField === "Date") {
          return dateConversion(item.createdAt) === selectedValue;
        } else if (filterField === "Source") {
          return item.Source_language === selectedValue;
        } else if (filterField === "Destination") {
          return item.Desired_language === selectedValue;
        }
        return true; 
      });

      setHistoryData(filteredHistory);
    }

    setSelectedFilterItem(selectedValue);
  };

  useEffect(() => {
    if (history !== null && ascend !== 0) {
      let sortedHistory = [...history];
      if (sortField === "Date" || sortField === "") {
        sortedHistory = sortedHistory.sort((a, b) => {
          if (ascend === 1) {
            return a.createdAt.localeCompare(b.createdAt);
          } else {
            return b.createdAt.localeCompare(a.createdAt);
          }
        });
      } else if (sortField === "Source") {
        sortedHistory = sortedHistory.sort((a, b) => {
          if (ascend === 1) {
            return a.Source_language.localeCompare(b.Source_language);
          } else {
            return b.Source_language.localeCompare(a.Source_language);
          }
        });
      } else if(sortField === "Destination") {
        sortedHistory = sortedHistory.sort((a, b) => {
          if (ascend === 1) {
            return a.Desired_language.localeCompare(b.Desired_language);
          } else {
            return b.Desired_language.localeCompare(a.Desired_language);
          }
        });
      }
      setHistoryData(sortedHistory);
    }
  }, [ascend]);

  if (history === null || showSidebar === false) return (<></>);
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
                  <FontAwesomeIcon id="ascdsc" icon={ascend === 1 ? faArrowUp : faArrowDown} onClick={() => setAscend(ascend * -1)} />
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
              {history.map((historyLabel, i) => (
                <div className="translationHistory" key={i}>
                  <h4>
                    {dateAndTimeConversion(history[i].createdAt)}
                  </h4>

                  <div className="codeHistory">

                    <div className="entrySource">
                      <h5>
                        Source Code ({history[i].Source_language})
                      </h5>
                      <p>
                        {history[i].original_code}
                      </p>
                    </div>

                    <div className="entryDest">
                      <h5>
                        Converted Code ({history[i].Desired_language})
                      </h5>
                      <p>
                        {history[i].converted_code}
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
      </Drawer>
    </>
  );
};


export default History;

