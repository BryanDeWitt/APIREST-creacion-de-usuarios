import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.js'
import { validateUser } from '../validations/validation.js'

export class UserController {
  static async getUsers (req, res) {
    try {
      const users = await UserModel.getUsers()

      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async findUser (req, res) {
    try {
      const { email } = req.params
      const user = await UserModel.findUser({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async createUser (req, res) {
    const checkEmail = req.body.email
    const isRegistered = await UserModel.findUser({ email: checkEmail })
    if (isRegistered) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { email, username, password } = result.data

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await UserModel.createUser({ email, username, password: hashedPassword })
      res.status(201).json(newUser)
    } catch (error) {
      console.error('Error during user registration:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async deleteUser (req, res) {
    const { email } = req.params
    const user = await UserModel.findUser({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    await UserModel.deleteUser({ email })
    res.json({ message: 'User deleted successfully' })
  }

  static async logIn (req, res) {
    const { email, password } = req.body
    const isUser = await UserModel.findUser({ email })
    if (isUser) {
      try {
        const passwordMatch = await bcrypt.compare(password, isUser.password)

        if (passwordMatch) {
          const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          })
          res.cookie('SSTK', token, {
            httpOnly: true
          })
          return res.json({ message: 'Login successful' })
        }

        return res.status(401).json({ message: 'Invalid password' })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
    return res.status(401).json({ message: 'User not found' })
  }

  static async changePassword (req, res) {
    try {
      const { email, password, newPassword } = req.body
      const user = await UserModel.findUser({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const oldPasswordMatch = await bcrypt.compare(password, user.password)

      if (!oldPasswordMatch) {
        return res.status(400).json({ message: 'Incorrect old password' })
      }

      const newPasswordMatch = await bcrypt.compare(newPassword, user.password)

      if (!newPasswordMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await UserModel.updatePassword({ email, password: hashedPassword })
      } else {
        return res.status(400).json({ message: 'Old password is the same as the new password' })
      }

      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async updateUserName (req, res) {
    try {
      const { email, newUserName } = req.body
      const user = await UserModel.findUser({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const updatedUser = await UserModel.updateUserName({ email, newUserName })

      res.json(updatedUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async logOut (req, res) {
    res.clearCookie('SSTK')
    res.json({ message: 'Logout successful' })
  }
}
