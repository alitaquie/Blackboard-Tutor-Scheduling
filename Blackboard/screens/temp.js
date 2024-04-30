loadItems = day => {
    const items = this.state.items || {}

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000
        const strTime = this.timeToString(time)

        if (!items[strTime]) {
          items[strTime] = []

          const numItems = Math.floor(Math.random() * 3 + 1)
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              //height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            })
          }
        }
      }

      const newItems = {}
      Object.keys(items).forEach(key => {
        newItems[key] = items[key]
      })
      this.setState({
        items: newItems
      })
    }, 1000)
  }