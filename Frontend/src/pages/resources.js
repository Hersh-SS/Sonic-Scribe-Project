import React from "react";
import NavigationBar from "../components/NavigationBar/NavigationBar";

const styles = {
	container: {
		fontFamily: "Arial, sans-serif",
		lineHeight: "1.6",
		padding: "20px",
		maxWidth: "800px",
		margin: "100px auto",
	},
	header: {
		textAlign: "center",
		color: "#333",
	},
	section: {
		marginBottom: "40px",
	},
	h1: {
		color: "#4a4a4a",
		fontSize: "32px",
		fontWeight: "bold",
	},
	h2: {
		color: "#5a5a5a",
		borderBottom: "2px solid #eee",
		paddingBottom: "10px",
	},
	ul: {
		listStyle: "none",
		paddingLeft: "0",
	},
	li: {
		marginBottom: "10px",
	},
	a: {
		textDecoration: "none",
		color: "#1a0dab",
	},
	aHover: {
		textDecoration: "underline",
	},
};

const ResourcesPage = () => {
	return (
		<div>
			<NavigationBar />

			<div style={styles.container}>
				<header style={styles.header}>
					<h1 style={styles.h1}>Learn to Read Sheet Music</h1>
				</header>
				<section style={styles.section}>
					<p>Welcome to our resource page for learning how to read sheet music. Here, you can find various tutorials, articles, and videos to help you get started.</p>
				</section>
				<section style={styles.section}>
					<h2 style={styles.h2}>Tutorials and Courses</h2>
					<ul style={styles.ul}>
						<li style={styles.li}>
							<a href="https://www.musicnotes.com/blog/how-to-read-sheet-music/" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Music Notes Blog: How to Read Sheet Music
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://hearandplay.com/" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Hear and Play Music Learning Center
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://musescore.com/courses" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Musescore Courses
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://soundfly.com/courses/how-to-read-music" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Soundfly: How to Read Music
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://learnsheetmusic.com/" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Learn Sheet Music
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.udemy.com/topic/reading-music/" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Udemy: Reading Music Courses
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.skillshare.com/en/classes/Learn-To-Read-Music/804233803" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Skillshare: Learn To Read Music
							</a>
						</li>
					</ul>
				</section>
				<section style={styles.section}>
					<h2 style={styles.h2}>Articles and Guides</h2>
					<ul style={styles.ul}>
						<li style={styles.li}>
							<a href="https://www.makeuseof.com/tag/10-online-resources-learn-read-music/" target="_blank" rel="noopener noreferrer" style={styles.a}>
								MakeUseOf: 10 Online Resources to Learn to Read Music
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://techboomers.com/learn-how-to-read-sheet-music-online" target="_blank" rel="noopener noreferrer" style={styles.a}>
								TechBoomers: Learn How to Read Sheet Music Online
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://music.tutsplus.com/7-sites-that-teach-you-to-read-music--audio-4705a" target="_blank" rel="noopener noreferrer" style={styles.a}>
								Tuts+: 7 Sites That Teach You to Read Music
							</a>
						</li>
					</ul>
				</section>
				<section style={styles.section}>
					<h2 style={styles.h2}>Videos</h2>
					<ul style={styles.ul}>
						<li style={styles.li}>
							<a href="https://www.youtube.com/watch?v=wJSQ9t0nG3Q" target="_blank" rel="noopener noreferrer" style={styles.a}>
								YouTube: Introduction to Reading Music
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.youtube.com/watch?v=-3WuQxnA7Hg" target="_blank" rel="noopener noreferrer" style={styles.a}>
								YouTube: 9 Rhythm Patterns for Beginners
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.youtube.com/watch?v=leIpJWeWYfA" target="_blank" rel="noopener noreferrer" style={styles.a}>
								YouTube: How To Read Music 2023
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.youtube.com/watch?v=QHs_2-pB_6c" target="_blank" rel="noopener noreferrer" style={styles.a}>
								YouTube: Reading Sheet Music Lesson
							</a>
						</li>
						<li style={styles.li}>
							<a href="https://www.youtube.com/watch?v=JFaKNR7eeJk" target="_blank" rel="noopener noreferrer" style={styles.a}>
								YouTube: Learn to Read Music
							</a>
						</li>
					</ul>
				</section>
			</div>
		</div>
	);
};

export default ResourcesPage;
