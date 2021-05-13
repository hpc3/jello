const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { default: axios } = require("axios");

require("dotenv/config");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const cors = require("cors");

const jwt = require("jsonwebtoken");

async function startApolloServer() {
  const typeDefs = gql`
    type Query {
      me(id: ID!): User
      allUsers: [User]
    }

    type User {
      id: ID!
      username: String!
      password: String!
      email: String!
      projects: [Project]!
    }

    type Project {
      id: ID!
      title: String!
      tasks: [Task]
    }

    type Task {
      id: ID!
      title: String!
      status: String!
      description: String
    }

    type LoginObject {
      user: User!
      token: String!
    }

    type Mutation {
      loginUser(identifier: String!, password: String!): LoginObject!
      createNewUser(
        username: String!
        password: String!
        email: String!
      ): LoginObject
      createNewProject(id: ID!, title: String!): Project
      deleteProject(userID: ID!, projectID: ID!, token: String!): String!
      editProjectTitle(
        userID: ID!
        projectID: ID!
        newTitle: String!
        token: String!
      ): String!
    }
  `;

  const resolvers = {
    Query: {
      allUsers: (parent, args) => {
        return axios
          .get("http://localhost:3000/users")
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));
      },
      me: (parent, args) => {
        return axios
          .get("http://localhost:3000/users")
          .then((res) => {
            return res.data.find((userObject) => userObject.id == args.id);
          })
          .catch((err) => console.log(err));
      },
    },
    Mutation: {
      loginUser: async (parent, { identifier, password }) => {
        try {
          if (identifier === "" && password === "") {
            throw new Error("Missing Data");
          }

          const allUserRequest = await axios.get("http://localhost:3000/users");

          const allUsersData = allUserRequest.data;

          const currentUser = allUsersData.find(
            (user) => user.username === identifier || user.email === identifier
          );

          if (currentUser === undefined) {
            throw new Error("User does not exist");
          }

          const checkPassword = await bcrypt.compare(
            password,
            currentUser.password
          );

          if (!checkPassword) {
            throw new Error("Password does not match");
          }

          const token = jwt.sign(currentUser.id, process.env.JWT_SECRET_TOKEN);

          const loginObject = {
            user: currentUser,
            token,
          };

          return loginObject;
        } catch (error) {
          return error;
        }
      },
      createNewUser: async (parent, { username, password, email }) => {
        // [v] - check if username or email already exist

        // [v] - Query that database and check if the username / email already exists

        // [v] - Post the new user

        // [v] - return a loginObject [user info + token]

        try {
          if (username !== "" && password !== "" && email !== "") {
            const allUserRequest = await axios.get(
              "http://localhost:3000/users"
            );

            const allUserArray = allUserRequest.data;

            const checkIfUserExists = allUserArray.some((user) => {
              return user.username === username || user.email === email;
            });

            if (checkIfUserExists) {
              throw new Error("User Already Exists");
            }

            const hashedPassword = bcrypt.hashSync(password, saltRounds);

            const user = {
              username,
              email,
              id: Date.now().toString(),
              password: hashedPassword,
              projects: [],
            };

            await axios.post("http://localhost:3000/users", user);

            const token = jwt.sign(user, process.env.JWT_SECRET_TOKEN);

            const loginObject = {
              user,
              token,
            };

            return loginObject;
          } else {
            throw new Error("Missing Data");
          }
        } catch (error) {
          return error;
        }
      },
      createNewProject: async (parent, { title, id }) => {
        try {
          const response = await axios.get(`http://localhost:3000/users/${id}`);

          const userData = response.data;

          const { projects } = userData;

          const checkIfRedundantTitle = projects.some(
            (proj) => proj.title === title
          );

          if (checkIfRedundantTitle) {
            throw new Error("Project Already Exsits");
          }

          const project = {
            id: Date.now(),
            title,
            tasks: [],
          };

          projects.push(project);

          await axios.patch(`http://localhost:3000/users/${id}`, {
            projects,
          });

          return project;
        } catch (error) {
          return error;
        }
      },
      deleteProject: async function (
        parent,
        { userID, projectID, token },
        context
      ) {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/${userID}`
          );

          const userData = response.data;

          const { projects } = userData;

          const checkIfProjectExists = projects.some(
            (project) => project.id == projectID
          );

          if (!checkIfProjectExists) {
            throw new Error("Project doesn't exist");
          }

          const updated = projects.filter((project) => project.id != projectID);

          await axios.patch(`http://localhost:3000/users/${userID}`, {
            projects: updated,
          });

          return true;
        } catch (error) {
          return error;
        }
      },
      editProjectTitle: async function (
        parent,
        { userID, projectID, newTitle, token }
      ) {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/${userID}`
          );

          const userData = response.data;

          const { projects } = userData;

          const checkIfProjectTitleExists = projects.some(
            (project) => project.title === newTitle
          );

          if (checkIfProjectTitleExists) {
            throw new Error("Project Title Taken");
          }

          projects.forEach((project) => {
            if (project.id == projectID) {
              project.title = newTitle;
              return;
            }
            return;
          });

          await axios.patch(`http://localhost:3000/users/${userID}`, {
            projects,
          });

          return true;

          // find project with the same project ID
          // Change title value
          // patch project object
        } catch (error) {
          return error;
        }
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();
  app.use(cors());

  app.post("/checkToken", (req, res) => {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader === undefined) {
      res.json(false).send();
    }

    const token = bearerHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err) => {
      if (err) {
        res.json(false).send();
      }

      res.json(true).send();
    });
  });

  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
