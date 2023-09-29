// Define variables
let page = 1;
const perPage = 10;

// Function to load movie data
function loadMovieData(title = null) {
  // Check if title is provided and set the page and pagination visibility accordingly
  if (title !== null) {
    page = 1;
    document.querySelector(".pagination").classList.add("d-none");
  } else {
    document.querySelector(".pagination").classList.remove("d-none");
  }

  // Fetch movie data from the API
  const url = title
    ? `/api/movies?page=${page}&perPage=${perPage}&title=${title}`
    : `/api/movies?page=${page}&perPage=${perPage}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Get the table body
      const tableBody = document.querySelector("#moviesTable tbody");
      // Clear existing rows
      tableBody.innerHTML = "";

      // Process the data and add rows to the table
      if (data && data.movies && data.movies.length > 0) {
        data.movies.forEach((movie) => {
          // Calculate hours and minutes from runtime
          const hours = Math.floor(movie.runtime / 60);
          const minutes = (movie.runtime % 60).toString().padStart(2, '0');

          // Create a new row for each movie
          const row = document.createElement("tr");
          row.setAttribute("data-id", movie._id);
          row.innerHTML = `
            <td>${movie.releaseYear}</td>
            <td>${movie.title}</td>
            <td>${movie.plot || "N/A"}</td>
            <td>${movie.rated || "N/A"}</td>
            <td>${hours}:${minutes}</td>
          `;

          // Add a click event listener to each row
          row.addEventListener("click", () => {
            // Show the modal and populate it with movie details
            showModal(movie);
          });

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      } else {
        // Handle the case where no movies were found
        console.log("No movies found.");
      }

      // Update the current page
      document.querySelector("#current-page").textContent = page;
    })
    .catch((error) => {
      console.error("Error fetching movie data: ", error);
    });
}

// Function to show the modal with movie details
function showModal(movie) {
  // Populate modal elements with movie details (use movie properties)
  const modalTitle = document.querySelector("#detailsModal .modal-title");
  const modalBody = document.querySelector("#detailsModal .modal-body");

  modalTitle.textContent = movie.title;

  modalBody.innerHTML = `
    <img class="img-fluid w-100" src="${movie.poster}">
    <br><br>
    <strong>Directed By:</strong> ${movie.directors.join(', ')}
    <br><br>
    <p>${movie.fullplot}</p>
    <strong>Cast:</strong> ${movie.cast.length > 0 ? movie.cast.join(', ') : 'N/A'}
    <br><br>
    <strong>Awards:</strong> ${movie.awards.text}
    <br>
    <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
  `;

  // Show the modal
  const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));
  detailsModal.show();
}

// Event listener for previous page button
document.querySelector("#previous-page").addEventListener("click", () => {
  if (page > 1) {
    page--;
    loadMovieData();
  }
});

// Event listener for next page button
document.querySelector("#next-page").addEventListener("click", () => {
  page++;
  loadMovieData();
});

// Event listener for search form submission
document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#title").value;
  loadMovieData(title);
});

// Event listener for clear form button
document.querySelector("#clearForm").addEventListener("click", () => {
  document.querySelector("#title").value = "";
  loadMovieData();
});

// Wait for DOMContentLoaded event before executing the code
document.addEventListener("DOMContentLoaded", () => {
  // Initial load of movie data
  loadMovieData();
});
