document.addEventListener('DOMContentLoaded', () => {

  // 1. HAMBURGER MENYU
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Menyu havolalari bosilganda mobil menyuni yopish
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. RAQAMLAR HISOB-KITOBLARI (COUNTER ANIMATION)
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 60; // tezlikni belgilash

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count).toLocaleString() + '+';
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target.toLocaleString() + '+';
        }
      };

      updateCount();
    });
  };

  // Statistika bo'limi scroll qilganda animatsiyani ishga tushirish
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        runCounters();
      }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 3. TELEFON RAQAMI MASKA: +998 (XX) XXX-XX-XX
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
      
      // O'zbekiston kodi +998 har doim saqlansin
      if (!x[1] || x[1] !== '998') {
        e.target.value = '+998 (';
        return;
      }

      e.target.value = !x[2] ? '+998 (' + x[1].substring(3)
        : '+998 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    });
  }

  // 4. BO'LIM YOKI SHIFOKOR TUGMALARI BOSILGANDA FORMADA AVTOMATIK TANLANISH
  const selectDeptBtns = document.querySelectorAll('.select-dept-btn');
  const deptSelect = document.getElementById('department');

  selectDeptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const deptName = btn.getAttribute('data-dept');
      if (deptSelect && deptName) {
        deptSelect.value = deptName;
        // Ariza formasiga silliq scroll qilish
        document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. ARIZA FORMASI VALIDATSIYASI VA LOCALSTORAGE
  const appointmentForm = document.getElementById('appointmentForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Elementlarni olish
      const fullName = document.getElementById('fullName');
      const phone = document.getElementById('phone');
      const department = document.getElementById('department');
      const dateTime = document.getElementById('dateTime');
      const reason = document.getElementById('reason');

      // Xato xabarlar panellari
      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');
      const deptError = document.getElementById('deptError');
      const dateError = document.getElementById('dateError');

      // Reset errors
      [fullName, phone, department, dateTime].forEach(el => el.classList.remove('invalid'));
      [nameError, phoneError, deptError, dateError].forEach(el => {
        el.innerText = '';
        el.classList.remove('visible');
      });

      // 1. Ism validatsiyasi
      if (!fullName.value.trim()) {
        fullName.classList.add('invalid');
        nameError.innerText = 'Iltimos, ism va familiyangizni kiriting.';
        nameError.classList.add('visible');
        isValid = false;
      }

      // 2. Telefon validatsiyasi (uzunligi to'liq bo'lishi kerak)
      if (phone.value.length < 19) {
        phone.classList.add('invalid');
        phoneError.innerText = 'Iltimos, to\'liq telefon raqamingizni kiriting.';
        phoneError.classList.add('visible');
        isValid = false;
      }

      // 3. Bo'lim tanlanishi validatsiyasi
      if (!department.value) {
        department.classList.add('invalid');
        deptError.innerText = 'Iltimos, kerakli bo\'limni tanlang.';
        deptError.classList.add('visible');
        isValid = false;
      }

      // 4. Sana va vaqt validatsiyasi
      if (!dateTime.value) {
        dateTime.classList.add('invalid');
        dateError.innerText = 'Iltimos, o\'zingizga qulay sana va vaqtni belgilang.';
        dateError.classList.add('visible');
        isValid = false;
      }

      // Agar barcha maydonlar to'g'ri bo'lsa
      if (isValid) {
        const newAppointment = {
          id: Date.now(),
          fullName: fullName.value.trim(),
          phone: phone.value,
          department: department.value,
          dateTime: dateTime.value,
          reason: reason.value.trim(),
          createdAt: new Date().toISOString()
        };

        // LocalStorage'ga saqlash
        const existingAppointments = JSON.parse(localStorage.getItem('medora_appointments') || '[]');
        existingAppointments.push(newAppointment);
        localStorage.setItem('medora_appointments', JSON.stringify(existingAppointments));

        // Formani tozalash
        appointmentForm.reset();
        phone.value = '+998 (';

        // Modalni ko'rsatish
        successModal.classList.add('active');
      }
    });
  }

  // Modalni yopish
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

});