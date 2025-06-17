# 1.7. Implement DataLoader for School-Student Relationship

## Description:
Optimize data fetching for the one-to-many relationship between School and Student models by implementing DataLoader. This task focuses on preventing the N+1 query problem by ensuring efficient data retrieval for related entities in both directions: when resolving students for a given school, and when resolving the associated school for a given student.

## Acceptance Criteria:
DataLoader is correctly implemented and integrated into the resolvers for both School to Student and Student to School relationships, leading to optimized database queries.

## For Operation in the studio apollographql
# mutation {
#   CreateSchool(input: {
#     name: "Universitas Indonesia6"
#     initial_name: "UI6"
#     address: "Jl. Depok 12356"
#     city: "Jawa Barat6"
#     country: "Indonesia6"
#     postal_code: "3331116"
#   }) {
#     id
#     name
#     initial_name
#     address
#     city
#     country
#     postal_code
#   }
# }

# query GetAllSchools {
#   GetAllSchools {
#     id
#     name
#     initial_name
#     address
#     city
#     country
#     postal_code
#   }
# }

# query {
#   GetOneSchool(id: "6850a98d0c7fe44139377528") {
#     name
#     initial_name
#     address
#     city
#     country
#     postal_code
#   }
# }

# mutation UpdateSchool {
#   UpdateSchool(
#     id: "6850a98d0c7fe44139377528",
#     input: {
#       name: "Universitas College1",
#       initial_name: "UC1",
#       address: "Street UC1",
#       city: "London1",
#       country: "United Kingdom1",
#       postal_code: "5551111"
#     }
#   ) {
#     id
#     name
#     initial_name
#     address
#     city
#     country
#     postal_code
#   }
# }

# mutation DeleteSchool {
#   DeleteSchool(id: "6850a98d0c7fe44139377528") {
#     id
#     name
#     initial_name
#     address
#     city
#     country
#     postal_code
#   }
# }

# ================================================

# mutation {
#   CreateStudent(input: {
#     first_name: "Rara8"
#     last_name: "Ira8"
#     email: "rai8@gmail.com"
#     date_of_birth: "2020-01-08"
#   }) {
#     id
#     first_name
#     last_name
#     email
#     date_of_birth
#   }
# }

# query GetAllStudents {
#   GetAllStudents {
#     id
#     first_name
#     last_name
#     email
#     date_of_birth
#   }
# }

# query {
#   GetOneStudent(id: "684f895559eea684ceb41f69") {
#     first_name
#     last_name
#     email
#     date_of_birth
#   }
# }

# mutation UpdateStudent {
#   UpdateStudent(
#     id: "684f895559eea684ceb41f69",
#     input: {
#       first_name: "Ririn",
#       last_name: "Kusuma",
#       email: "ririnkusuma4@gmail.com",
#       date_of_birth: "2020-02-01"
#     }
#   ) {
#     id
#     first_name
#     last_name
#     email
#     date_of_birth
#   }
# }

# mutation DeleteStudent {
#   DeleteStudent(id: "684f895559eea684ceb41f69") {
#     id
#     first_name
#     last_name
#     email
#     date_of_birth
#   }
# }

# ================================================

# mutation {
#   CreateUser(input: {
#     first_name: "Rani335"
#     last_name: "Ali335"
#     email: "rali335@gmail.com"
#     role: "Dev"
#     password: "lalalili1233354"
#   }) {
#     id
#     first_name
#     last_name
#     email
#     role
#     password
#   }
# }

# query GetAllUsers {
#   GetAllUsers {
#     id
#     first_name
#     last_name
#     email
#     role
#   }
# }

# query {
#   GetOneUser(id: "6843a9301bc7ac1236c5a9a3") {
#     first_name
#     last_name
#     email
#     role
#   }
# }

# mutation UpdateUser {
#   UpdateUser(
#     id: "6843a9301bc7ac1236c5a9a3",
#     input: {
#       first_name: "rai22",
#       last_name: "kusuma22",
#       email: "raikusuma22@gmail.com",
#       role: "admin"
#       password: "123ppp1112"
#     }
#   ) {
#     id
#     first_name
#     last_name
#     email
#     role
#     password
#   }
# }

# mutation DeleteUser {
#   DeleteUser(id: "6843a9301bc7ac1236c5a9a3") {
#     id
#     first_name
#     last_name
#     email
#     role
#     password
#   }
# }
