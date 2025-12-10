export const dummySessionsFull = Array.from({ length: 25 }).map((_, i) => {
    const date = new Date(2025, 4, 5 + i) // 5月
    const formatted = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}（${"日一二三四五六"[date.getDay()]}）`
  
    return {
      sessionId: 200 + i,
      sessionName:["陶藝：手捏杯", "花藝：春季花束", "金工：戒指體驗"][i % 3],
      courseName: ["陶藝", "花藝", "金工"][i % 3],
      date: formatted,
      startTime: ["10:00", "14:00", "19:00"][i % 3],
      teacher: ["Mina", "小慧", "阿廷"][i % 3],
      remainingSeats: [3, 2, 0][i % 3],
      isHoliday: ["平日", "平日", "假日"][i % 3]
    }
  })
  