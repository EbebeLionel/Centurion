import './Models_dec.css';
import Header from '../Header_space/Header';

const Models = () => {
    return ( 
        <>
            <Header />
            <main>
                <section>
                    <div className="parent-content-new-tab">
                    <div className="second-nav">
                        <ul>
                        <li>
                            <a href="#characters" target="_blank">Characters</a>
                        </li>
                        <li>
                            <a href="#architecture" target="_blank">Architecture</a>
                        </li>
                        <li>
                            <a href="#vehicles" target="_blank">Vehicles</a>
                        </li>
                        <li>
                            <a href="#swords" target="_blank">Swords</a>
                        </li>
                        </ul>
                    </div>
                    <div className="gallery">
                        
                            <div className="pointer-react">
                                <a href="" target="_blank"><img src="https://tse3.mm.bing.net/th?id=OIP.uIDEAgOeB1feLJ4hBcZRJQHaEK&pid=Api&P=0&h=220" /></a>
                                <div className="overlay"></div>
                                <div className="title"><h3>Malenia</h3></div>
                            </div>
                            <div className="pointer-react">
                                <a href="" target="_blank"><img src="https://tse2.mm.bing.net/th?id=OIP.5p1oE1izcBrr6kqPaB755AHaEK&pid=Api&P=0&h=220" /></a>
                                <div className="overlay"></div>
                                <div className="title"><h3>Radahn</h3></div>
                            </div>
                            <div className="pointer-react">
                                <a href="" target="_blank"><img src="https://tse2.mm.bing.net/th?id=OIP.RvZBJb7M19bnds9w5pH4ugHaE5&pid=Api&P=0&h=220" /></a>
                                <div className="overlay"></div>
                                <div className="title"><h3>Goku</h3></div>
                            </div>
                            <div className="pointer-react">
                                <a href="" target="_blank"><img src="https://tse2.mm.bing.net/th?id=OIP.6kFD8fmxtr0I65f5eIeywgHaGL&pid=Api&P=0&h=220" /></a>
                                <div className="overlay"></div>
                                <div className="title"><h3>Vegeta</h3></div>
                            </div>
                    
                    </div>
                
            </div>   
        </section>
    </main>
        </>
     );
}
 
export default Models;