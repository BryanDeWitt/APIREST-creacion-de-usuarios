import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const userRouter = Router()

userRouter.get('/', UserController.getUsers) // check
userRouter.get('/:email', UserController.findUser) // check
userRouter.post('/log-in', UserController.logIn) // check
userRouter.post('/log-out', UserController.logOut) // check
userRouter.post('/sign-in', UserController.createUser) // check
userRouter.patch('/update-password', UserController.changePassword) // turbo check
userRouter.patch('/update-username', UserController.updateUserName) // check
userRouter.delete('/delete-user/:email', UserController.deleteUser) // check
