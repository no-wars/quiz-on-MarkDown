---
Duration: 15m
Randomisation: off
---

# Какая команда показывает права доступа к файлу?
video: https://youtu.be/zBjJUV-lzHo
PrintAnswer: true
ReadAnswer: ls -l

# Как изменить права доступа к файлу?
img: https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2022/02/tux_upclose_hero_1.jpg?w=1200&h=675&fit=crop
PrintAnswer: true
ReadAnswer: chmod

# Как изменить владельца файла?
PrintAnswer: true
ReadAnswer: chown

# Какая команда показывает текущую файловую систему?
PrintAnswer: true
ReadAnswer: df

# Какая команда отображает скрытые файлы?
PrintAnswer: false
[] ls -h
[] ls -a
[] ls -l
[] ls -d
ReadAnswer: ls -a

# Как скопировать директорию со всем содержимым?
PrintAnswer: true
ReadAnswer: cp -r

# Какая команда выводит информацию о свободном месте на диске?
PrintAnswer: false
[] free
[] df -h
[] du
[] lsblk
ReadAnswer: df -h

# Как просмотреть размер файла?
PrintAnswer: false
[] ls -s
[] du -h
[] stat
[] df
ReadAnswer: du -h

# Как проверить, существует ли файл?
PrintAnswer: true
ReadAnswer: test -f

# Какая команда объединяет несколько файлов в один?
PrintAnswer: false
[] merge
[] concat
[] cat
[] join
ReadAnswer: cat

