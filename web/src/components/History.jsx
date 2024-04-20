import React, { useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import emptybox from '../images/emptybox.png';
//import nhaService from '../services/nhaService';
import { selectHistory } from '../features/histories/historiesSlice';
// import { useSelector, useDispatch } from 'react-redux';
import useHistoryManagement from '../useHistoryManagement'
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
  return dateObject.toLocaleDateString('en-US', options);
};

const loadInputAndTranslatedCode = (setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, inputCode, translatedCode, sourceLanguage, desiredLanguage) => {
  setInputCode(inputCode);
  setTranslatedCode(translatedCode);
  setSourceLanguage(sourceLanguage); // Set the source language dropdown value
  setDesiredLanguage(desiredLanguage); // Set the desired language dropdown value
}

const History = ({ setTriggerHistory, triggerHistory, user, dbUserRedux, showSidebar, toggleSidebar, setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage }) => {
  const { reduxHandleDeleteHistory, reduxHandleGetAllHistory } = useHistoryManagement();
  const originalHistory = useSelector(selectHistory);
  const [width, setWidth] = useState(window.innerWidth);
  // const [originalHistory, setOriginalHistory] = useState(null);
  const [history, setHistoryData] = useState(null);
  const [historyError, setHistoryError] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortField, setSortField] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedItem, setSelectedFilterItem] = useState("");

  useEffect(() => {
    console.log(originalHistory);
    setHistoryData(originalHistory);
  }, [originalHistory]);

  const changeSort = (e) => {
    setSortField(e.target.value);
  };

  const changeFilter = (e) => {
    setSelectedFilterItem("");
    setFilterField(e.target.value);
    changeFilterOptions(e.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    const handleGetAllHistory = async () => {
      setHistoryError(''); //reset history error before getting
      try {
        // throw new Error("Simulated history error");
        
        // const fetchedHistory = await nhaService.getAllHistory(user, dbUserRedux);
        // setOriginalHistory(fetchedHistory);
        // setHistoryData(fetchedHistory);
        
        reduxHandleGetAllHistory(user, dbUserRedux);
        setHistoryData(originalHistory);

        // const fetchedHistory = useSelector(selectHistory);
        // setOriginalHistory(fetchedHistory);
        // setHistoryData(fetchedHistory);

        // reduxHandleGetAllHistory(user, dbUserRedux);
        // setHistoryData(originalHistory);
      } catch (error) {
        // setHistoryError('Unable to retrieve history at this time.');
        setHistoryError(error);
      }
    };

    if (triggerHistory) {
      handleGetAllHistory();
      // const state = useSelector(selectHistory);
      // setOriginalHistory(state);
      // setHistoryData(state);
      setTriggerHistory(false);
    }
  }, [user, dbUserRedux, triggerHistory, 
      setTriggerHistory, reduxHandleGetAllHistory, originalHistory]);

  useEffect(() => {
    setSortField("");
    setSortOrder(-1);
    setFilterField("");
    setSelectedFilterItem("");
    setFilterOptions([]);
  }, [showSidebar]);

  const changeFilterOptions = (filter) => {
    const objects = new Set();
    originalHistory.forEach((element) => {
      if (filter === "Date") {
        objects.add(formatDate(element.createdAt, false));
      } else if (filter === "Source") {
        objects.add(element.Source_language);
      } else if (filter === "Destination") {
        objects.add(element.Desired_language);
      }
    });
    setFilterOptions(Array.from(objects));
  };

  const changeSelectedFilterItem = (e) => {
    const selectedValue = e.target.value;
    setSortOrder(-1);
    if (selectedValue === "") {
      setHistoryData(originalHistory);
    } else {
      const filteredHistory = originalHistory.filter((item) => {
        if (filterField === "Date") {
          return formatDate(item.createdAt, false) === selectedValue;
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
    const sortByDate = (a, b) => {
      return sortOrder === 1 ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
    };

    const sortBySource = (a, b) => {
      return sortOrder === 1 ? a.Source_language.localeCompare(b.Source_language) : b.Source_language.localeCompare(a.Source_language);
    };

    const sortByDestination = (a, b) => {
      return sortOrder === 1 ? a.Desired_language.localeCompare(b.Desired_language) : b.Desired_language.localeCompare(a.Desired_language);
    };

    if (history !== null && sortOrder !== 0) {
      let sortedHistory = [...history];

      if (sortField === "Date" || sortField === "") {
        sortedHistory.sort(sortByDate);
      } else if (sortField === "Source") {
        sortedHistory.sort(sortBySource);
      } else if (sortField === "Destination") {
        sortedHistory.sort(sortByDestination);
      }

      setHistoryData(sortedHistory);
    }
    // the line below is because react wants history to be in the dependency array, but that causes infinite re-renders as we set history data above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, sortField]);

  const deleteFromHistory = async (i = null) => {
    if (i === null) {
      // await nhaService.deleteHistory(user, dbUserRedux);
      // setOriginalHistory([]);
      // setHistoryData([]);
      // return;

      reduxHandleDeleteHistory(user, dbUserRedux);
      setHistoryData(originalHistory);
      return;
    }

      const deleteId = history[i]._id;
      reduxHandleDeleteHistory(user, dbUserRedux, deleteId);

    // var deleteId = history[i]._id;
    // await nhaService.deleteHistory(user, dbUserRedux, deleteId);
    // setOriginalHistory(originalHistory.filter((yeet) => {return yeet._id !==  deleteId}));
    // setHistoryData(history.filter((yeet) => {return yeet._id !==  deleteId}));

    // var deleteId = history[i]._id;
    // dispatch(deleteHistory({ user, dbUserRedux, deleteId }));
    // setHistoryData(history.filter((yeet) => {return yeet._id !==  deleteId}));


    // setOriginalHistory(useSelector(selectHistory));
    originalHistory = originalHistory.filter((yeet) => {return yeet._id !==  deleteId});
    setHistoryData(history.filter((yeet) => {return yeet._id !==  deleteId}));
  }

  const clearDropdowns = () => {
    setSortField("");
    setFilterField("");
    setSortOrder(-1);
    setSelectedFilterItem("");
    setHistoryData(originalHistory);
    setFilterOptions([]);
  }

  if (showSidebar === false) return (<></>);

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
          <div className="historyError" data-testid="historyError">
            <h1 className="errorText">{historyError}</h1>
          </div>
        ) : (
          <>
            {history.length === 0 && originalHistory.length === 0 ? (
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
                      <FontAwesomeIcon id="ascdsc" icon={sortOrder === 1 ? faArrowUp : faArrowDown} onClick={() => setSortOrder(sortOrder * -1)} />
                    </button>

                    {/* sort by */}
                    <select id="sort" onChange={changeSort} value={sortField}>
                      <option value=""> Sort By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>

                    {/* filter by */}
                    <select id="filter" onChange={changeFilter} value={filterField}>
                      <option value=""> Filter By... </option>
                      <option value="Date"> Date </option>
                      <option value="Source"> Source Language </option>
                      <option value="Destination"> Destination Language </option>
                    </select>
                    {/* </div> */}

                    {/* filter options */}
                    <select id="filterOptions" onChange={changeSelectedFilterItem} value={selectedItem}>
                      <option value=""> Select Filter... </option>
                      {filterOptions.map((item, index) => (
                        <option value={item} key={index}> {filterOptions[index]} </option>
                      ))}
                    </select>
                  </div>

                  {/* clear all history */}
                  <button id="clearAll" className="ripple" onClick={() => deleteFromHistory()}> Clear All History </button>

                  {/* clear filter and sort options */}
                  <button id="clearAll" className="ripple" onClick={() => clearDropdowns()}> Clear Dropdowns </button>
                </div>

                <div>
                  {history.map((historyLabel, i) => (
                    <div className="translationHistory" key={i}>
                      <h4>
                        {formatDate(history[i].createdAt, true)}
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
                        <button data-testid="translateAgain" id="translateAgain" onClick={() => loadInputAndTranslatedCode(setInputCode, setTranslatedCode, setSourceLanguage, setDesiredLanguage, history[i].original_code, history[i].converted_code, history[i].Source_language, history[i].Desired_language)}> Translate again </button>
                        <button id="removeEntry" title="Remove translation">
                          <FontAwesomeIcon id="trashIcon" icon={faTrashCan} size="2x" onClick={() => deleteFromHistory(i)} />
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

export default History;
