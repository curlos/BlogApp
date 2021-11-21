import React, { useEffect } from 'react'
import './pagination.css'

export const Pagination = ({ data, setPaginatedPosts, pageLimit, dataLimit, currentPage, setCurrentPage, category }) => {

  useEffect(() => {
    setPaginatedData(currentPage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const currentStartNum = ((currentPage * dataLimit - dataLimit) + 1)
  const currentEndNum = ((currentPage * dataLimit - dataLimit) + dataLimit - 1 === data.length ? data.length : (currentPage * dataLimit - dataLimit) + dataLimit)
  return (
    <div className="pagContainer">
      <div className="pagResults">Showing <strong>{currentStartNum}</strong> to <strong>{currentEndNum}</strong> of <strong>{data.length}</strong> results</div>
      <div className="pagController">
        <div className="pagNum pagPrev" onClick={goToPreviousPage}><i className="fas fa-chevron-left"></i></div>

        {getPaginationGroup().map((pageNum) => <div className={`pagNum ${currentPage === pageNum ? 'selectedPag' : ''}`} onClick={changePage}>{pageNum}</div>)}
        
        <div className="pagNum pagNext" onClick={goToNextPage}><i className="fas fa-chevron-right"></i></div>
      </div>

      <div className="pagMobileController">
        <div className="pagPrevMobile" onClick={goToPreviousPage}><i className="fas fa-chevron-left"></i> Previous</div>

        <div className="pagNextMobile" onClick={goToNextPage}>Next <i className="fas fa-chevron-right"></i></div>
      </div>
    </div>
  )
}
