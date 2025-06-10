// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const db = require('../../core/database');

// *************** For Student data load
const batchStudents = async (ids) => {
  const students = await db.getStudentsByIds(ids);
  const studentMap = new Map(students.map(student => [student.id, student]));
  return ids.map(id => studentMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchStudents;