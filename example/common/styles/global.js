const values = {
  color: '#fff',
  bgColor: '#999'
};

export default {
  html: {
    width: '100%',
    height: '100%',
    margin: 0,
    fontSize: '100%'
  },
  mediaQueries: {
    '(min-width: 550px)': {
      html:  {
        fontSize: '120%'
      }
    },
    '(min-width: 1200px)': {
      html:  {
        fontSize: '140%'
      }
    }
  },

  body: {
    width: '100%',
    height: '100%',
    margin: 0,
    overflow: 'hidden',
    backgroundColor: values.bgColor,
    color: values.color
  },
}
