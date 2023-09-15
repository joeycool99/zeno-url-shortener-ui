import React, { useState, useEffect } from "react"
import styles from "./styles.module.css"
import axios from "axios"

const Main = () => {
  const [fullUrl, setFullUrl] = useState("")
  const [shortUrls, setShortUrls] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
       await axios.post("/shortUrls",{ fullUrl },
      {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      setFullUrl("")
      getAllUrls()
    } catch (error) {
      console.error(error)
    }
  }

  function getAllUrls() {
    axios.get("/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setShortUrls(response.data.shortUrls)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    getAllUrls()
  }, [])

  const openShortUrlInNewTab = (shortUrl) => {
    const fullShortUrl = axios.defaults.baseURL + `/${shortUrl}`
    window.open(fullShortUrl, "_blank")
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>Zeno URL Shortener</h1>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
      <div className={styles.container}>
        <div className={styles.input_flex}>
          <form
            onSubmit={handleSubmit}
            className={`${styles.form_inline} my-4`}
          >
            <input
              required
              placeholder="Full Url"
              type="url"
              name="fullUrl"
              id="fullUrl"
              className={`${styles.form_control} col mr-2`}
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
            />
            <button className={styles.btn_success} type="submit">
              Shrink
            </button>
          </form>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full URL</th>
              <th>Short URL</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {shortUrls.map((shortUrl, index) => (
              <tr key={index}>
                <td>
                  <a
                    href={shortUrl.full}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortUrl.full}
                  </a>
                </td>
                <td>
                  <button
                    className={styles.short_url_button}
                    onClick={() => openShortUrlInNewTab(shortUrl.short)}
                  >
                    {shortUrl.short}
                  </button>
                </td>
                <td>{shortUrl.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Main
