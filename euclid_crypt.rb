# Based on https://gist.github.com/728456

module EuclidCrypt
  require 'base64'

  EUCLID_SALT = "JlNO5MO40fLWEiZdgzL"

  def self.encrypt(salt, str)
    cipher = Gibberish::AES.new(salt)
    Base64.urlsafe_encode64(cipher.enc(str, {:binary => true}))
  end

  def self.decrypt(salt, str)
    cipher = Gibberish::AES.new(salt)
    #cipher.dec(Base64.urlsafe_decode64(str), {:binary => true})
  end

end