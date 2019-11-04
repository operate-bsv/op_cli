const axios = require('axios')

const headers = {
  api_key: '5wDmWYdXcpkixV4XDpSTiX2G3H9KfWqYtWMAaG15jw94FVd913BHyr3tf2vvazTfA2'
}

const client = axios.create({
  baseURL: 'https://api.bitindex.network/api/v3/main/',
  headers
})

const bitindex = {
  client,

  getUtxo(addr) {
    return this.client.get(`/addr/${ addr }/utxo`)
      .then(r => {
        // Sort UTXO by confirmations then vout index
        return r.data.sort((a, b) => {
          if (a.confirmations === b.confirmations) {
            return a.vout - b.vout;
          } else {
            return b.confirmations - a.confirmations;
          }
        })
      })
      .catch(err => {
        throw new Error(err.response.data.message)
      })
  },

  sendTx(tx) {
    const rawtx = tx.toString();
    return this.client.post('/tx/send', { rawtx })
      .then(r => r.data.txid)
      .catch(err => {
        const error = err.response.data.message;
        const msg = error.message
          .split('\n')
          .slice(0, -1)
          .join(' ')
        throw new Error(msg)
      })
  }

}

module.exports = bitindex;