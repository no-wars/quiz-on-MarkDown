---
Duration: 5m 30s
Randomisation: on
---

# Какая команда показывает список активных процессов?
PrintAnswer: true
ReadAnswer: ps

# Какая команда выводит системную информацию (ядро, архитектура)?
PrintAnswer: true
ReadAnswer: uname -a

# Как вывести список всех подключенных дисков?
PrintAnswer: false
[] lsusb
[] lspci
[] lsblk
[] disks
ReadAnswer: lsblk

# Какая команда показывает текущего пользователя?
PrintAnswer: true
ReadAnswer: whoami

# Какая команда показывает, кто вошел в систему?
PrintAnswer: true
ReadAnswer: who

# Как вывести список всех пользователей в системе?
PrintAnswer: true
ReadAnswer: cat /etc/passwd

# Какая команда показывает использование дискового пространства?
PrintAnswer: true
ReadAnswer: df -h

# Какая команда показывает объем памяти?
video: https://youtu.be/zBjJUV-lzHo
PrintAnswer: true
ReadAnswer: free -h

# Как завершить работу системы?
PrintAnswer: true
ReadAnswer: shutdown now

# Какая команда перезагружает систему?
PrintAnswer: true
ReadAnswer: reboot

