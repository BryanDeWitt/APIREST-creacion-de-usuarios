import { User } from '../schemas/mongooseSchemas.js'

export class UserModel {
  static async findUser ({ email }) {
    try {
      const user = await User.findOne({ email })
      return user || null
    } catch (error) {
      console.error('Error during findUser:', error)
      throw error
    }
  }

  static async getUsers () {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      console.error('Error during getUsers:', error)
      throw error
    }
  }

  static async createUser ({ email, username, password }) {
    try {
      const user = new User({ email, username, password })
      const savedUser = await user.save()
      return savedUser
    } catch (error) {
      console.error('Error during user creation:', error)
      throw error
    }
  }

  static async updatePassword ({ email, password }) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('User not found')
      }
      const id = user.id
      const updatedUser = await User.findByIdAndUpdate(id, { password }, { new: true })
      return updatedUser
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async updateUserName ({ email, newUserName }) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('User not found')
      }
      const id = user.id
      const updatedUser = await User.findByIdAndUpdate(id, { username: newUserName }, { new: true })
      return updatedUser
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async deleteUser ({ email }) {
    try {
      const user = await User.findOneAndDelete({ email })
      return user || null
    } catch (error) {
      console.error('Error during deleteUser:', error)
      throw error
    }
  }
}
