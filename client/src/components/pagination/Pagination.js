import React, { useState, useEffect } from 'react'
import './pagination.css'

export const Pagination = ({ data, setPaginatedPosts, pageLimit, dataLimit, category }) => {
  const [pages] = useState(Math.round(data.length / dataLimit))
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setPaginatedData(currentPage)
  }, [currentPage, category])

  const goToNextPage = () => {
    if (currentPage === pageLimit) {
      return
    }

    setCurrentPage((page) => page + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage === 1) {
      return
    }

    setCurrentPage((page) => page - 1)
  }

  const changePage = (e) => {
    const pageNumber = Number(e.target.textContent)
    setCurrentPage(pageNumber)
  }

  const setPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    console.log(data.slice(startIndex, endIndex))
    console.log('updating posts')
    setPaginatedPosts(data.slice(startIndex, endIndex))
  }

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <div className="pagContainer">
      <div className="pagResults">Showing <strong>{(currentPage * dataLimit - dataLimit) + 1}</strong> to <strong>{(currentPage * dataLimit - dataLimit) + dataLimit - 1 === data.length ? data.length : (currentPage * dataLimit - dataLimit) + dataLimit}</strong> of <strong>{data.length}</strong> results</div>
      <div className="pagController">
        <div className="pagNum pagPrev" onClick={goToPreviousPage}><i className="fas fa-chevron-left"></i></div>

        {getPaginationGroup().map((pageNum) => <div className={`pagNum ${currentPage === pageNum ? 'selectedPag' : ''}`} onClick={changePage}>{pageNum}</div>)}
        
        <div className="pagNum pagNext" onClick={goToNextPage}><i className="fas fa-chevron-right"></i></div>

      </div>
    </div>
  )
}
